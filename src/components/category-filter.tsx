import Link from "next/link";

export function CategoryFilter({
  categories,
  activeCategory,
}: {
  categories: string[];
  activeCategory?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link
        href="/dashboard"
        className={
          !activeCategory
            ? "rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
            : "rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
        }
      >
        전체
      </Link>
      {categories.map((name) => (
        <Link
          key={name}
          href={`/dashboard?category=${encodeURIComponent(name)}`}
          className={
            activeCategory === name
              ? "rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
              : "rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          }
        >
          {name}
        </Link>
      ))}
    </div>
  );
}
