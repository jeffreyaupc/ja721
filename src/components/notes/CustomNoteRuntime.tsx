"use client";

import { useEffect } from "react";

/**
 * Generic expand/collapse runtime for custom note pages. Replaces the inline
 * <script> the reference mock embedded per-note: stored custom_html never
 * contains a <script> tag, and this delegated handler keys off the
 * aria-expanded attribute the markup itself declares, so any future custom
 * note reusing the same [data-role]/aria-expanded idiom works with no new code.
 */
export function CustomNoteRuntime() {
  useEffect(() => {
    const root = document.getElementById("custom-note-root");
    if (!root) return;

    function findToggle(el: Element | null): Element | null {
      return el?.closest("[aria-expanded]") ?? null;
    }

    function toggle(el: Element) {
      const expanded = el.getAttribute("aria-expanded") === "true";
      el.setAttribute("aria-expanded", String(!expanded));
      const icon = el.querySelector(".toggle-icon");
      if (icon) icon.textContent = expanded ? "+" : "×";
    }

    function onClick(e: MouseEvent) {
      const el = findToggle(e.target as Element);
      if (el) toggle(el);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const el = findToggle(e.target as Element);
      if (el) {
        e.preventDefault();
        toggle(el);
      }
    }

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
