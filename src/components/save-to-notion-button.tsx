"use client";

import { useState, useTransition } from "react";
import { saveArticleToNotion } from "@/app/dashboard/actions";

export function SaveToNotionButton({
  articleId,
  initialSaved,
}: {
  articleId: number;
  initialSaved: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved);
  const [failed, setFailed] = useState(false);

  function handleClick() {
    setFailed(false);
    startTransition(async () => {
      try {
        await saveArticleToNotion(articleId);
        setSaved(true);
      } catch {
        setFailed(true);
      }
    });
  }

  if (saved) {
    return (
      <button
        disabled
        className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      >
        저장됨
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-60 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      {isPending ? "저장 중..." : failed ? "저장 실패, 재시도" : "뉴스 저장"}
    </button>
  );
}
