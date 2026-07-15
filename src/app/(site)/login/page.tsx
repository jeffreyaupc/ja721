"use client";

import { useActionState } from "react";
import { signIn } from "@/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 px-6 py-16 sm:px-10">
      <h1 className="font-serif-tc text-2xl font-semibold text-ink">登入</h1>
      <form action={action} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink-soft">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded border border-line bg-paper-3 px-3 py-2 text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-soft">
          密碼
          <input
            type="password"
            name="password"
            required
            className="rounded border border-line bg-paper-3 px-3 py-2 text-ink"
          />
        </label>
        {state?.error && (
          <p className="font-mono text-xs text-seal">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 self-start rounded bg-seal px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper-3"
        >
          {pending ? "登入中..." : "登入"}
        </button>
      </form>
    </div>
  );
}
