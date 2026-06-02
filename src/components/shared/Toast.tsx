import { useEffect, useState, type ReactNode } from "react";

export type ToastKind = "info" | "error" | "success";
interface ToastItem { id: number; msg: string; kind: ToastKind }

let pushExt: ((msg: string, kind?: ToastKind) => void) | null = null;
export function pushToast(msg: string, kind: ToastKind = "info") {
  pushExt?.(msg, kind);
}

export function ToastHost({ children }: { children?: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    pushExt = (msg, kind = "info") => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, msg, kind }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 1800);
    };
    return () => { pushExt = null; };
  }, []);
  return (
    <>
      <div
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-sm font-bold text-sm shadow-lg ${
              t.kind === "error" ? "bg-foreground text-background" : t.kind === "success" ? "bg-tile-correct text-tile-text" : "bg-foreground text-background"
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
      {children}
    </>
  );
}
