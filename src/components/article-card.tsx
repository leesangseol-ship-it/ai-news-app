type Article = {
  id: number;
  url: string;
  source: string;
  isDomestic: boolean;
  language: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: Date | null;
};

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {article.category}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {article.isDomestic ? "국내" : "해외"}
        </span>
      </div>

      <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">
        {article.title}
      </h2>

      <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {article.summary}
      </p>

      <div className="mt-auto flex flex-col gap-1 pt-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {article.source} · {article.language.toUpperCase()}
          {article.publishedAt
            ? ` · ${article.publishedAt.toLocaleDateString("ko-KR")}`
            : ""}
        </span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          원문 보기
        </a>
      </div>
    </article>
  );
}
