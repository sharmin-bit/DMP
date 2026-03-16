import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="app-shell flex h-screen text-slate-100">
      {/* Sidebar */}
      <aside className="relative flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/70 px-5 py-6 backdrop-blur-2xl">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-fuchsia-500 text-base font-semibold text-white shadow-lg shadow-indigo-500/40">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-slate-50">
              Prompt2Deploy
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.24em] text-slate-500">
              Console
            </span>
          </div>
        </div>

        <nav className="space-y-1 text-sm">
          <button className="flex w-full items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2.5 text-slate-50 shadow-sm shadow-slate-900/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => navigate("/idea")}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-slate-300 transition hover:bg-slate-900/80 hover:text-slate-50"
          >
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>New Project</span>
            </span>
            <span className="text-[0.65rem] text-slate-500">Ctrl + N</span>
          </button>

          <button className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-slate-300 transition hover:bg-slate-900/80 hover:text-slate-50">
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>Saved Plans</span>
            </span>
            <span className="text-[0.65rem] text-slate-500">Soon</span>
          </button>

          <button className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-slate-300 transition hover:bg-slate-900/80 hover:text-slate-50">
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>Cloud Platforms</span>
            </span>
            <span className="text-[0.65rem] text-slate-500">Overview</span>
          </button>
        </nav>

        <div className="mt-auto rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-[0.7rem] text-slate-400">
          <p className="font-medium text-slate-300">Today’s focus</p>
          <p className="mt-1">
            Turn one idea into a complete stack and deployment plan.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-50">
              Dashboard
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              High-level view of your generated ideas and deployment plans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                placeholder="Search projects…"
                className="w-52 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3.5 py-2 text-xs text-slate-100 outline-none ring-0 transition focus:border-indigo-400 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[0.65rem] text-slate-500">
                /
              </span>
            </div>

            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-200 shadow-sm shadow-slate-900/80 transition hover:border-indigo-400 hover:text-indigo-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Realtime</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Projects", value: "247", trend: "+18%", tone: "from-sky-500/70 to-indigo-500/70" },
            { label: "Ideas Today", value: "04", trend: "+2", tone: "from-emerald-500/70 to-teal-500/70" },
            { label: "Generated Plans", value: "189", trend: "92%", tone: "from-amber-500/70 to-orange-500/70" },
            { label: "Active Users", value: "156", trend: "Live", tone: "from-fuchsia-500/70 to-pink-500/70" },
          ].map((card, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.8)]"
            >
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${card.tone} opacity-60 blur-2xl`}
              />
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-slate-500">
                {card.label}
              </p>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-2xl font-semibold text-slate-50">{card.value}</h3>
                <span className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[0.6rem] font-medium text-emerald-300">
                  {card.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
          {/* Projects Table */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-50">
                Recent Ideas
              </h3>
              <span className="rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[0.6rem] font-medium text-slate-400">
                Sample data
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">User</th>
                    <th className="py-2 pr-4">Idea</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 text-right" />
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "#1247",
                      user: "John",
                      idea: "E-commerce app with React",
                      date: "Dec 15",
                    },
                    {
                      id: "#1246",
                      user: "Sarah",
                      idea: "Task manager with Firebase",
                      date: "Dec 14",
                    },
                  ].map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-800/80 last:border-0 hover:bg-slate-900/60"
                    >
                      <td className="py-3 pr-4 text-[0.75rem] text-slate-300">
                        {row.id}
                      </td>
                      <td className="py-3 pr-4 text-[0.75rem] text-slate-200">
                        {row.user}
                      </td>
                      <td className="py-3 pr-4 text-[0.75rem] text-slate-300">
                        {row.idea}
                      </td>
                      <td className="py-3 pr-4 text-[0.75rem] text-slate-400">
                        {row.date}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate("/plan")}
                          className="rounded-full bg-indigo-500/15 px-3 py-1 text-[0.7rem] font-medium text-indigo-200 ring-1 ring-inset ring-indigo-500/40 transition hover:bg-indigo-500/30 hover:text-indigo-50"
                        >
                          View plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Stack Trends */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-sky-500/25 to-indigo-500/25 opacity-70 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-500/25 to-violet-500/25 opacity-70 blur-3xl" />

            <div className="relative">
              <h3 className="text-sm font-semibold text-slate-50">
                Tech stack trends
              </h3>
              <p className="mt-1 text-[0.7rem] text-slate-400">
                Popular choices from recent generated plans.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "React", tone: "from-sky-400/80 to-indigo-400/80" },
                  { label: "Node.js", tone: "from-emerald-400/80 to-teal-400/80" },
                  { label: "JavaScript", tone: "from-amber-400/80 to-orange-400/80" },
                  { label: "Firebase", tone: "from-orange-400/80 to-red-400/80" },
                  { label: "Python", tone: "from-fuchsia-400/80 to-violet-400/80" },
                ].map((tag) => (
                  <span
                    key={tag.label}
                    className={`inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-[0.7rem] text-slate-100 ring-1 ring-inset ring-slate-700/80`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${tag.tone}`}
                    />
                    <span>{tag.label}</span>
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-3 text-[0.7rem] text-slate-300 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3">
                  <p className="text-xs font-medium text-slate-200">
                    Frontend focus
                  </p>
                  <p className="mt-1 text-[0.7rem] text-slate-400">
                    Most students pair React with serverless or containerized
                    backends.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3">
                  <p className="text-xs font-medium text-slate-200">
                    Deployment patterns
                  </p>
                  <p className="mt-1 text-[0.7rem] text-slate-400">
                    Netlify + Render + managed databases is a common beginner
                    friendly combo.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}