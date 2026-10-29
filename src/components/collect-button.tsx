"use client";

import { useState, useTransition } from "react";
import { collectArticles } from "@/app/dashboard/actions";

export function CollectButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    startTransition(async () => {
      const result = await collectArticles();
      const errorNote =
        result.errors.length > 0 ? ` (${result.errors.join(", ")} 실패)` : "";
      setMessage(`${result.added}개의 새 기사를 가져왔습니다.${errorNote}`);
    });
  }

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className="text-sm text-slate-500 dark:text-slate-400">{message}</span>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? "가져오는 중..." : "뉴스 가져오기"}
      </button>
    </div>
  );
}
