import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";

export default function Dashboard() {

  const navigate = useNavigate();
  const { projectData } = useContext(ProjectContext);
  const [downloading, setDownloading] = useState(false);

  const techstackId = useMemo(() => {
    return (
      projectData?.techstack_id ||
      localStorage.getItem("techstack_id") ||
      ""
    );
  }, [projectData?.techstack_id]);

  const token = useMemo(() => {
    // app currently uses both keys in different pages; be tolerant here
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  }, []);

  const hasExtractedStack =
    (projectData?.languages?.length || 0) +
      (projectData?.frameworks?.length || 0) +
      (projectData?.databases?.length || 0) +
      (projectData?.cloud?.length || 0) >
    0;

  const downloadPlan = async () => {
    if (!techstackId) {
      alert("Tech stack not found. Please generate your stack first.");
      navigate("/idea");
      return;
    }
    if (!token) {
      alert("You are not logged in.");
      navigate("/");
      return;
    }

    try {
      setDownloading(true);
      const response = await fetch(
        "http://127.0.0.1:8000/api/myapp/download-plan/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ techstack_id: techstackId }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Backend error:", error);
        throw new Error("Failed to download plan");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "deployment_plan.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Error downloading deployment plan");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center px-4 py-8 text-slate-100">
      <div className="w-full max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-50">
              Dashboard
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Your current project state and backend actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate("/idea")}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
            >
              New idea
            </button>
            <button
              onClick={() => navigate("/stack")}
              className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-100"
            >
              Continue stack
            </button>
            <button
              onClick={() => navigate("/wizard")}
              className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-100"
            >
              Deployment preferences
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
            <h3 className="text-sm font-semibold text-slate-50">
              Current idea
            </h3>
            <p className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-sm text-slate-200">
              {projectData?.idea?.trim()
                ? projectData.idea
                : "No idea saved yet. Click “New idea” to start."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                  Techstack id
                </p>
                <p className="mt-1 font-mono text-xs text-slate-200">
                  {techstackId || "Not generated yet"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                  Auth token
                </p>
                <p className="mt-1 text-xs text-slate-200">
                  {token ? "Available" : "Missing (login required)"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
            <h3 className="text-sm font-semibold text-slate-50">
              Extracted stack
            </h3>
            <p className="mt-1 text-[0.75rem] text-slate-400">
              This is what your backend extracted from the idea prompt.
            </p>

            {!hasExtractedStack ? (
              <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-300">
                No extracted stack yet. Submit an idea to generate one.
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-xs text-slate-200">
                {[
                  { label: "Languages", value: projectData?.languages },
                  { label: "Frameworks", value: projectData?.frameworks },
                  { label: "Databases", value: projectData?.databases },
                  { label: "Cloud", value: projectData?.cloud },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-200">
                      {item.value?.length ? item.value.join(", ") : "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => navigate("/plan")}
                className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-2.5 text-xs font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-100"
              >
                View plan page
              </button>
              <button
                onClick={downloadPlan}
                disabled={downloading}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {downloading ? "Downloading…" : "Download plan PDF"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}