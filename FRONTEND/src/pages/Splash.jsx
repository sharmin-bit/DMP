import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";

export default function Splash() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const durationMs = 4200;
  const fadeOutMs = 520;

  const particles = useMemo(
    () => [
      { top: "12%", left: "18%", size: 14, opacity: 0.42, delay: "0ms" },
      { top: "22%", left: "76%", size: 10, opacity: 0.3, delay: "180ms" },
      { top: "40%", left: "12%", size: 8, opacity: 0.26, delay: "420ms" },
      { top: "58%", left: "86%", size: 12, opacity: 0.34, delay: "140ms" },
      { top: "78%", left: "22%", size: 9, opacity: 0.26, delay: "260ms" },
      { top: "70%", left: "64%", size: 7, opacity: 0.22, delay: "520ms" },
      { top: "34%", left: "56%", size: 6, opacity: 0.18, delay: "320ms" },
    ],
    []
  );

  useEffect(() => {
    const t1 = setTimeout(() => {
      setLeaving(true);
    }, Math.max(0, durationMs - fadeOutMs));

    const t2 = setTimeout(() => {
      navigate("/login", { replace: true });
    }, durationMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [navigate]);

  return (
    <div
      className={[
        "app-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-slate-100",
        leaving ? "p2d-splash-out" : "p2d-splash-in",
      ].join(" ")}
    >
      <FloatingLogo />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="p2d-orb left-[10%] top-[18%] h-56 w-56 bg-indigo-500/25" />
        <div className="p2d-orb left-[70%] top-[14%] h-44 w-44 bg-sky-500/18 [animation-delay:700ms]" />
        <div className="p2d-orb left-[66%] top-[64%] h-64 w-64 bg-fuchsia-500/18 [animation-delay:420ms]" />
        <div className="p2d-orb left-[18%] top-[68%] h-52 w-52 bg-violet-500/16 [animation-delay:980ms]" />

        <div className="absolute inset-0 opacity-60">
          {particles.map((p, idx) => (
            <span
              key={idx}
              className="absolute rounded-full bg-slate-200/60 blur-[1px] [animation:p2d-drift_6.5s_ease-in-out_infinite]"
              style={{
                top: p.top,
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="p2d-shape p2d-shape-left left-[-40px] top-[44%] h-24 w-44 rotate-[-10deg]" />
        <div className="p2d-shape p2d-shape-right right-[-40px] top-[36%] h-28 w-48 rotate-[12deg]" />
      </div>

      <div className="w-full max-w-xl rounded-3xl border border-slate-700/70 bg-slate-900/45 p-10 text-center shadow-[0_28px_90px_rgba(15,23,42,0.92)] backdrop-blur-3xl">
        <div className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-24 w-[min(520px,92%)] rounded-full bg-gradient-to-r from-indigo-500/15 via-sky-500/10 to-fuchsia-500/15 blur-3xl" />

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-fuchsia-500 text-2xl font-semibold text-white p2d-logo-glow">
          ⚡
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
            Prompt2Deploy
          </span>
        </h1>

        <p className="p2d-tagline mt-3 text-sm text-slate-300/90">
          Turn your ideas into deployment blueprints
        </p>

        <div className="mt-8">
          <div className="p2d-progress mx-auto h-1.5 w-44 rounded-full bg-slate-800/70" />
          <div className="mt-3 flex items-center justify-center gap-2 text-[0.7rem] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 [animation:p2d-reveal_900ms_ease-out_both]" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 [animation:p2d-reveal_900ms_ease-out_both] [animation-delay:180ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 [animation:p2d-reveal_900ms_ease-out_both] [animation-delay:360ms]" />
            <span>Initializing workspace…</span>
          </div>
        </div>
      </div>
    </div>
  );
}

