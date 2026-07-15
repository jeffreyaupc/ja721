import { EditableText } from "@/components/editor/EditableText";
import { updateSiteSettingsField } from "@/actions/site-settings";
import type { SiteSettings } from "@/lib/types";

export default function Footer({
  settings,
  isAuthor,
}: {
  settings: SiteSettings;
  isAuthor: boolean;
}) {
  return (
    <footer className="mx-auto w-full max-w-5xl border-t border-line px-6 py-10 sm:px-10">
      {isAuthor ? (
        <EditableText
          as="p"
          value={settings.footer_text}
          onSave={updateSiteSettingsField.bind(null, "footer_text")}
          className="font-serif-tc text-sm text-ink-faint"
        />
      ) : (
        <p className="font-serif-tc text-sm text-ink-faint">
          {settings.footer_text}
        </p>
      )}
    </footer>
  );
}
