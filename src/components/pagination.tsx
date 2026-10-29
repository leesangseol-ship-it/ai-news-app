import Link from "next/link";

const SIBLING_COUNT = 2;

function getPageNumbers(currentPage: number, totalPages: number) {
  const start = Math.max(2, currentPage - SIBLING_COUNT);
  const end = Math.min(totalPages - 1, currentPage + SIBLING_COUNT);

  const pages: (number | "...")[] = [1];
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  category,
}: {
  currentPage: number;
  totalPages: number;
  category?: string;
}) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1 text-sm">
      <PageLink page={1} category={category} disabled={currentPage <= 1}>
        처음
      </PageLink>
      <PageLink page={currentPage - 1} category={category} disabled={currentPage <= 1}>
        이전
      </PageLink>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-slate-400 dark:text-slate-600"
          >
            ...
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            className="rounded-full bg-blue-600 px-3 py-1.5 font-medium text-white"
          >
            {page}
          </span>
        ) : (
          <PageLink key={page} page={page} category={category}>
            {page}
          </PageLink>
        ),
      )}

      <PageLink page={currentPage + 1} category={category} disabled={currentPage >= totalPages}>
        다음
      </PageLink>
      <PageLink page={totalPages} category={category} disabled={currentPage >= totalPages}>
        끝
      </PageLink>
    </nav>
  );
}

function PageLink({
  page,
  category,
  disabled,
  children,
}: {
  page: number;
  category?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-full px-3 py-1.5 font-medium text-slate-300 dark:text-slate-700">
        {children}
      </span>
    );
  }
  const query = category
    ? `page=${page}&category=${encodeURIComponent(category)}`
    : `page=${page}`;
  return (
    <Link
      href={`/dashboard?${query}`}
      className="rounded-full px-3 py-1.5 font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
    >
      {children}
    </Link>
  );
}
