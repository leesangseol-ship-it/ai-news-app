export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
            AI 뉴스
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-5 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
