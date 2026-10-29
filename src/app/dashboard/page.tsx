import { count, desc, eq } from "drizzle-orm";
import { UserButton } from "@clerk/nextjs";
import { AuthGate } from "@/components/auth-gate";
import { ArticleCard } from "@/components/article-card";
import { CollectButton } from "@/components/collect-button";
import { Pagination } from "@/components/pagination";
import { db } from "@/db";
import { articles, categories } from "@/db/schema";

const PAGE_SIZE = 9;

async function getArticles(page: number) {
  return db
    .select({
      id: articles.id,
      url: articles.url,
      source: articles.source,
      isDomestic: articles.isDomestic,
      language: articles.language,
      title: articles.translatedTitle,
      originalTitle: articles.originalTitle,
      summary: articles.summary,
      category: categories.name,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .innerJoin(categories, eq(articles.categoryId, categories.id))
    .orderBy(desc(articles.publishedAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);
}

async function getArticleCount() {
  const [row] = await db.select({ value: count() }).from(articles);
  return row.value;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const totalCount = await getArticleCount();
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);

  const rows = await getArticles(page);
  const items = rows.map((row) => ({
    id: row.id,
    url: row.url,
    source: row.source,
    isDomestic: row.isDomestic,
    language: row.language,
    title: row.title ?? row.originalTitle,
    summary: row.summary,
    category: row.category,
    publishedAt: row.publishedAt,
  }));

  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
              AI 뉴스
            </h1>
            <div className="flex items-center gap-4">
              <CollectButton />
              <UserButton />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <svg
                className="h-10 w-10 text-slate-300 dark:text-slate-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 19.5V6a2 2 0 0 1 2-2h8l6 6v9.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v6h6" />
              </svg>
              <p className="font-medium text-slate-500 dark:text-slate-400">
                아직 수집된 뉴스가 없습니다.
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                뉴스가 수집되면 이 화면에 카드로 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} />
          )}
        </main>
      </div>
    </AuthGate>
  );
}
