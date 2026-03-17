import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function toneStyles(tone) {
  if (tone === "success") {
    return {
      dot: "bg-emerald-400",
      ring: "ring-emerald-500/30",
      title: "text-emerald-100",
    };
  }
  if (tone === "error") {
    return {
      dot: "bg-rose-400",
      ring: "ring-rose-500/30",
      title: "text-rose-100",
    };
  }
  if (tone === "warning") {
    return {
      dot: "bg-amber-400",
      ring: "ring-amber-500/30",
      title: "text-amber-100",
    };
  }
  return {
    dot: "bg-sky-400",
    ring: "ring-sky-500/30",
    title: "text-sky-100",
  };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    ({ title, message, tone = "info", durationMs = 2600 }) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now() + Math.random());

      setToasts((prev) => [
        ...prev,
        {
          id,
          title: title || (tone === "error" ? "Something went wrong" : "Notice"),
          message: message || "",
          tone,
        },
      ]);

      window.setTimeout(() => remove(id), durationMs);
      return id;
    },
    [remove]
  );

  const api = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-50 w-[min(380px,calc(100vw-2rem))] space-y-2">
        {toasts.map((t) => {
          const s = toneStyles(t.tone);
          return (
            <div
              key={t.id}
              className={[
                "pointer-events-auto overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/80 p-4 shadow-[0_18px_60px_rgba(2,6,23,0.75)] backdrop-blur-2xl ring-1",
                s.ring,
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span className={["mt-1.5 h-2 w-2 rounded-full", s.dot].join(" ")} />
                <div className="min-w-0 flex-1">
                  <p className={["text-xs font-semibold", s.title].join(" ")}>
                    {t.title}
                  </p>
                  {t.message ? (
                    <p className="mt-1 text-xs text-slate-300">{t.message}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-900/60 hover:text-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

