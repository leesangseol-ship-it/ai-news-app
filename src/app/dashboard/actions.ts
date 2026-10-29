"use server";

import Parser from "rss-parser";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, categories } from "@/db/schema";
import { RSS_SOURCES } from "@/rss-sources";

const UNCATEGORIZED_NAME = "미분류";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

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
      .returning({ id: articles.id });
    added = inserted.length;
  }

  revalidatePath("/dashboard");
  return { added, errors };
}
