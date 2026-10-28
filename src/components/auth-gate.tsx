"use client";

import { useEffect } from "react";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

function SignInModalPrompt() {
  const { openSignIn } = useClerk();

  useEffect(() => {
    openSignIn({});
  }, [openSignIn]);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <p className="text-zinc-500 dark:text-zinc-400">로그인이 필요합니다.</p>
    </div>
  );
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <SignInModalPrompt />
      </SignedOut>
    </>
  );
}
