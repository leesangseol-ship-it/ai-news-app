"use server";

import Parser from "rss-parser";
import { revalidatePath } from "next/cache";
import { eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { articles, categories } from "@/db/schema";
import { RSS_SOURCES } from "@/rss-sources";
import { analyzeArticle } from "@/lib/claude";

const UNCATEGORIZED_NAME = "미분류";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const PROCESS_CONCURRENCY = 4;

async function getUncategorizedCategoryId() {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, UNCATEGORIZED_NAME))
    .limit(1);
  if (existing.length > 0) return existing[0].id;

  const [created] = await db
    .insert(categories)
    .values({ name: UNCATEGORIZED_NAME })
    .returning({ id: categories.id });
  return created.id;
}

async function resolveCategoryId(name: string) {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, name))
    .limit(1);
  if (existing.length > 0) return existing[0].id;

  const [created] = await db
    .insert(categories)
    .values({ name })
    .onConflictDoNothing()
    .returning({ id: categories.id });
  if (created) return created.id;

  const retry = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, name))
    .limit(1);
  return retry[0]?.id ?? (await getUncategorizedCategoryId());
}

async function processArticle(article: {
  id: number;
  originalTitle: string;
  originalContent: string | null;
  language: string;
}) {
  const existingCategories = await db
    .select({ name: categories.name })
    .from(categories);

  try {
    const analysis = await analyzeArticle({
      title: article.originalTitle,
      content: article.originalContent,
      language: article.language,
      existingCategories: existingCategories.map((c) => c.name),
    });
    const categoryId = await resolveCategoryId(analysis.categoryName);

    await db
      .update(articles)
      .set({
        translatedTitle: analysis.translatedTitle,
        translatedContent: analysis.translatedContent,
        summary: analysis.summary,
        categoryId,
        processingStatus: "done",
        processingError: null,
      })
      .where(eq(articles.id, article.id));
  } catch (err) {
    await db
      .update(articles)
      .set({
        processingStatus: "failed",
        processingError: err instanceof Error ? err.message : String(err),
      })
      .where(eq(articles.id, article.id));
  }
}

async function processInChunks(
  items: {
    id: number;
    originalTitle: string;
    originalContent: string | null;
    language: string;
  }[],
) {
  for (let i = 0; i < items.length; i += PROCESS_CONCURRENCY) {
    const chunk = items.slice(i, i + PROCESS_CONCURRENCY);
    await Promise.all(chunk.map(processArticle));
  }
}

export async function reprocessFailedArticles() {
  const pending = await db
    .select({
      id: articles.id,
      originalTitle: articles.originalTitle,
      originalContent: articles.originalContent,
      language: articles.language,
    })
    .from(articles)
    .where(ne(articles.processingStatus, "done"));

  await processInChunks(pending);
  revalidatePath("/dashboard");
  return { reprocessed: pending.length };
}

export async function collectArticles() {
  const parser = new Parser();
  const categoryId = await getUncategorizedCategoryId();
  const cutoff = Date.now() - ONE_DAY_MS;

  const errors: string[] = [];
  const rows: (typeof articles.$inferInsert)[] = [];

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      for (const item of feed.items) {
        if (!item.link || !item.title || !item.pubDate) continue;
        const publishedAt = new Date(item.pubDate);
        if (Number.isNaN(publishedAt.getTime()) || publishedAt.getTime() < cutoff) {
          continue;
        }
        rows.push({
          url: item.link,
          source: source.name,
          isDomestic: source.isDomestic,
          language: source.language,
          originalTitle: item.title,
          originalContent: item.content ?? null,
          author: item.creator ?? item.author ?? null,
          summary: item.contentSnippet ?? item.content ?? "",
          categoryId,
          publishedAt,
        });
      }
    } catch {
      errors.push(source.name);
    }
  }

  let added = 0;
  if (rows.length > 0) {
    const inserted = await db
      .insert(articles)
      .values(rows)
      .onConflictDoNothing({ target: articles.url })
      .returning({
        id: articles.id,
        originalTitle: articles.originalTitle,
        originalContent: articles.originalContent,
        language: articles.language,
      });
    added = inserted.length;
    await processInChunks(inserted);
  }

  revalidatePath("/dashboard");
  return { added, errors };
}
