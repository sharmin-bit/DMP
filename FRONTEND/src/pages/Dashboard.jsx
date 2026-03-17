import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";
import { useToast } from "../components/ToastProvider.jsx";

const PROJECTS_KEY = "p2d_projects_v1";
const MAX_PROJECTS = 5;

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export default function Dashboard() {

  const navigate = useNavigate();
  const { projectData, setProjectData } = useContext(ProjectContext);
  const toast = useToast();
  const [downloading, setDownloading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState("");

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

  useEffect(() => {
    const stored = safeJsonParse(localStorage.getItem(PROJECTS_KEY), []);
    setProjects(Array.isArray(stored) ? stored : []);
  }, []);

  const hasExtractedStack =
    (projectData?.languages?.length || 0) +
      (projectData?.frameworks?.length || 0) +
      (projectData?.databases?.length || 0) +
      (projectData?.cloud?.length || 0) >
    0;

  const currentProject = useMemo(() => {
    const idea = (projectData?.idea || "").trim();
    const stack = {
      languages: projectData?.languages || [],
      frameworks: projectData?.frameworks || [],
      databases: projectData?.databases || [],
      cloud: projectData?.cloud || [],
    };
    const hasIdea = Boolean(idea);
    const hasStack = hasExtractedStack;

    return {
      id: techstackId || "",
      idea,
      stack,
      createdAt: new Date().toISOString(),
      hasIdea,
      hasStack,
      answers: projectData?.answers || {},
      deployment: projectData?.deployment || null,
    };
  }, [
    hasExtractedStack,
    projectData?.answers,
    projectData?.cloud,
    projectData?.databases,
    projectData?.deployment,
    projectData?.frameworks,
    projectData?.idea,
    projectData?.languages,
    techstackId,
  ]);

  const persistProjects = (next) => {
    setProjects(next);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
  };

  const saveCurrentToHistory = () => {
    if (!currentProject.id || !currentProject.hasIdea) {
      toast.push({
        tone: "warning",
        title: "Nothing to save yet",
        message: "Create an idea and generate a tech stack first.",
      });
      return;
    }

    const existing = projects.find((p) => String(p.id) === String(currentProject.id));
    const entry = {
      ...currentProject,
      // keep existing createdAt if present
      createdAt: existing?.createdAt || currentProject.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const next = [
      entry,
      ...projects.filter((p) => String(p.id) !== String(currentProject.id)),
    ].slice(0, MAX_PROJECTS);
    persistProjects(next);
  };

  // Auto-save whenever a new techstack is created (keep only last 5).
  // Uses localStorage as source-of-truth to avoid stale state bugs.
  useEffect(() => {
    if (!currentProject.id || !currentProject.hasIdea) return;

    const stored = safeJsonParse(localStorage.getItem(PROJECTS_KEY), []);
    const list = Array.isArray(stored) ? stored : [];

    const existing = list.find((p) => String(p.id) === String(currentProject.id));
    const entry = {
      ...currentProject,
      createdAt: existing?.createdAt || currentProject.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const next = [
      entry,
      ...list.filter((p) => String(p.id) !== String(currentProject.id)),
    ].slice(0, MAX_PROJECTS);

    // Avoid re-writing if nothing changed (reduces rerenders)
    const prevJson = JSON.stringify(list);
    const nextJson = JSON.stringify(next);
    if (prevJson !== nextJson) {
      localStorage.setItem(PROJECTS_KEY, nextJson);
      setProjects(next);
    }
  }, [currentProject]);

  const clearCurrent = () => {
    setProjectData({
      idea: "",
      stack: {},
      answers: {},
      cloud: {},
    });
    localStorage.removeItem("techstack_id");
    setActiveId("");
  };

  const openProject = (p) => {
    setProjectData({
      idea: p.idea || "",
      techstack_id: p.id,
      languages: p.stack?.languages || [],
      frameworks: p.stack?.frameworks || [],
      databases: p.stack?.databases || [],
      cloud: p.stack?.cloud || [],
      answers: p.answers || {},
      deployment: p.deployment || null,
      stack: {},
    });
    localStorage.setItem("techstack_id", String(p.id));
    setActiveId(String(p.id));
  };

  const deleteProject = (id) => {
    const next = projects.filter((p) => String(p.id) !== String(id));
    persistProjects(next);
    if (String(activeId) === String(id)) setActiveId("");
  };

  const logout = async () => {
    // Optional backend logout (blacklist refresh token). Ignore failures.
    const refresh = localStorage.getItem("refreshToken");
    try {
      if (refresh) {
        await fetch("http://127.0.0.1:8000/api/myapp/auth/logout/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });
      }
    } catch (e) {
      console.warn("Logout API failed:", e);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("techstack_id");
      setActiveId("");
      navigate("/login", { replace: true });
    }
  };

  const downloadPlan = async () => {
    if (!techstackId) {
      toast.push({
        tone: "warning",
        title: "Missing tech stack",
        message: "Generate your stack first.",
      });
      navigate("/idea");
      return;
    }
    if (!token) {
      toast.push({
        tone: "warning",
        title: "Login required",
        message: "Please sign in to download the plan.",
      });
      navigate("/login");
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
      toast.push({
        tone: "error",
        title: "Download failed",
        message: "Couldn’t download the deployment plan.",
      });
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
              Your projects, stack, and deployment blueprint actions.
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
            <button
              onClick={logout}
              className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-100 transition hover:bg-rose-500/20"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Current project
                </h3>
                <p className="mt-1 text-[0.75rem] text-slate-400">
                  Clear layout of your idea and extracted stack.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={saveCurrentToHistory}
                  className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-100"
                >
                  Save to projects
                </button>
                <button
                  onClick={clearCurrent}
                  className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-amber-400 hover:text-amber-100"
                >
                  Clear current
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Idea
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                  {projectData?.idea?.trim()
                    ? projectData.idea
                    : "No idea saved yet. Click “New idea” to start."}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                      Session
                    </p>
                    <p className="mt-1 text-xs text-slate-200">
                      {token ? "Authenticated" : "Not logged in"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Extracted stack
                </p>
                <p className="mt-1 text-[0.75rem] text-slate-400">
                  Generated from your idea using the backend extractor.
                </p>

                {!hasExtractedStack ? (
                  <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-300">
                    No extracted stack yet. Submit an idea to generate one.
                  </div>
                ) : (
                  <div className="mt-3 space-y-3 text-xs text-slate-200">
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

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Previous projects
                </h3>
                <p className="mt-1 text-[0.75rem] text-slate-400">
                  Saved locally on this browser.
                </p>
              </div>
              <span className="rounded-full border border-slate-800/80 bg-slate-950/60 px-2.5 py-1 text-[0.65rem] font-medium text-slate-300">
                {projects.length}/{MAX_PROJECTS}
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-300">
                No saved projects yet. Generate a stack and it will appear here.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {projects.slice(0, MAX_PROJECTS).map((p) => {
                  const isActive = String(p.id) === String(activeId || techstackId);
                  const dateLabel = p.createdAt
                    ? new Date(p.createdAt).toLocaleString()
                    : "—";
                  const stackBadges = [
                    ...(p.stack?.frameworks || []),
                    ...(p.stack?.languages || []),
                    ...(p.stack?.databases || []),
                    ...(p.stack?.cloud || []),
                  ]
                    .filter(Boolean)
                    .slice(0, 6);

                  return (
                    <div
                      key={p.id}
                      className={[
                        "rounded-2xl border bg-slate-950/60 p-4 transition",
                        isActive
                          ? "border-indigo-500/40 shadow-[0_0_0_1px_rgba(99,102,241,0.25)]"
                          : "border-slate-800/80 hover:border-slate-700/80",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-slate-200">
                            {p.idea || "Untitled idea"}
                          </p>
                          <p className="mt-1 text-[0.7rem] text-slate-500">
                            <span className="font-mono">#{p.id}</span> · {dateLabel}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => openProject(p)}
                            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-1.5 text-[0.7rem] font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-100"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => deleteProject(p.id)}
                            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-1.5 text-[0.7rem] font-medium text-slate-200 transition hover:border-rose-400 hover:text-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {stackBadges.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {stackBadges.map((tag) => (
                            <span
                              key={`${p.id}-${tag}`}
                              className="rounded-full border border-slate-800/80 bg-slate-950/70 px-2.5 py-1 text-[0.65rem] text-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}