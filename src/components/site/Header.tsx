import { EditableText } from "@/components/editor/EditableText";
import { SignOutButton } from "@/components/editor/SignOutButton";
import { updateSiteSettingsField } from "@/actions/site-settings";
import type { SiteSettings } from "@/lib/types";
import Link from "next/link";

export default function Header({
  settings,
  isAuthor,
}: {
  settings: SiteSettings;
  isAuthor: boolean;
}) {
  return (
    <header className="mx-auto w-full max-w-5xl px-6 pb-10 pt-16 sm:px-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 rotate-[-4deg] items-center justify-center rounded-[3px_6px_4px_7px] bg-seal text-paper-3 shadow-md">
          {isAuthor ? (
            <EditableText
              value={settings.seal_text}
              onSave={updateSiteSettingsField.bind(null, "seal_text")}
              className="text-sm font-bold tracking-widest [writing-mode:vertical-rl]"
            />
          ) : (
            <span className="text-sm font-bold tracking-widest [writing-mode:vertical-rl]">
              {settings.seal_text}
            </span>
          )}
        </div>
        {isAuthor && <SignOutButton />}
      </div>

      {isAuthor ? (
        <EditableText
          as="p"
          value={settings.eyebrow}
          onSave={updateSiteSettingsField.bind(null, "eyebrow")}
          className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint"
        />
      ) : settings.eyebrow ? (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          {settings.eyebrow}
        </p>
      ) : null}

      {isAuthor ? (
        <EditableText
          as="h1"
          value={settings.title}
          onSave={updateSiteSettingsField.bind(null, "title")}
          className="mb-3 font-serif-tc text-4xl font-bold leading-tight text-ink sm:text-5xl"
        />
      ) : (
        <h1 className="mb-3 font-serif-tc text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {settings.title}
        </h1>
      )}

      {isAuthor ? (
        <EditableText
          as="p"
          value={settings.motto}
          onSave={updateSiteSettingsField.bind(null, "motto")}
          className="mb-6 font-serif-tc text-lg text-seal"
        />
      ) : (
        <p className="mb-6 font-serif-tc text-lg text-seal">{settings.motto}</p>
      )}

      {isAuthor ? (
        <EditableText
          as="p"
          value={settings.intro}
          onSave={updateSiteSettingsField.bind(null, "intro")}
          multiline
          className="max-w-2xl whitespace-pre-line text-base leading-relaxed text-ink-soft"
        />
      ) : (
        <p className="max-w-2xl whitespace-pre-line text-base leading-relaxed text-ink-soft">
          {settings.intro}
        </p>
      )}

      {!isAuthor && (
        <Link
          href="/login"
          className="mt-8 inline-block font-mono text-[11px] uppercase tracking-widest text-ink-faint/60 hover:text-ink-faint"
        >
          手記
        </Link>
      )}
    </header>
  );
}
