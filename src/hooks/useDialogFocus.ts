import { useEffect } from "react";

export function useDialogFocus(
  open: boolean,
  selector: string,
  close: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const dialog = document.querySelector<HTMLElement>(selector);
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const scope = dialog.closest(".phone-screen");
    const background = scope
      ? [...scope.children].filter(
          (n) => n.tagName === "MAIN" || n.tagName === "NAV",
        )
      : [document.querySelector(".experience")];
    background.forEach((n) => {
      if (n instanceof HTMLElement) n.inert = true;
    });
    const focusables = () =>
      [
        ...dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled),input,select,[tabindex="0"]',
        ),
      ].filter((n) => n.getClientRects().length);
    focusables()[0]?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab") {
        const targets = focusables(),
          first = targets[0],
          last = targets.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      background.forEach((n) => {
        if (n instanceof HTMLElement) n.inert = false;
      });
      previous?.focus();
    };
  }, [open, selector]);
}
