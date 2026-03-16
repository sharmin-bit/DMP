export default function FloatingLogo() {
  return (
    <div className="flex justify-center pt-6 pb-6 animate-float">
      <div className="relative flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/90 px-6 py-2.5 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
        <div className="absolute inset-px rounded-2xl border border-slate-800/80" />

        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-fuchsia-500 text-base font-semibold text-white shadow-lg shadow-indigo-500/40">
          ⚡
        </div>

        <div className="relative flex flex-col">
          <span className="text-sm font-semibold tracking-wide text-slate-50">
            Prompt2Deploy
          </span>
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-slate-500">
            Idea · Stack · Cloud
          </span>
        </div>
      </div>
    </div>
  );
}

