"use client";

import { signOut } from "@/actions/auth";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="font-mono text-xs uppercase tracking-widest text-ink-faint hover:text-seal"
    >
      登出
    </button>
  );
}
