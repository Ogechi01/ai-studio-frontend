import { useEffect, useRef, useState } from "react";
import api, { errorMessage } from "../api/axios";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import SceneCard from "../components/SceneCard";

const TONES = ["Drama", "Action", "Romance", "Horror", "Comedy", "Thriller"];
const MIN_STORY = 20;
const MAX_STORY = 20000;

const inputClass =
  "rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [story, setStory] = useState("");
  const [tone, setTone] = useState("Drama");
  const [scenes, setScenes] = useState([]);
  const [loadingScenes, setLoadingScenes] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [showNewProject, setShowNewProject] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Remembers which project was clicked last, so a slow answer for an
  // older project can't overwrite the one on screen
  const latestProject = useRef("");

  /* ---------- load a project's saved story and scenes ---------- */
  const openProject = async (projectId) => {
    latestProject.current = projectId;
    setSelectedProject(projectId);
    setError("");
    setNotice("");

    if (!projectId) {
      setScenes([]);
      return;
    }

    setLoadingScenes(true);

    try {
      const res = await api.get(`/projects/${projectId}`);
      if (latestProject.current !== projectId) return;

      setScenes(res.data.scenes || []);
      setStory(res.data.story || "");
      if (res.data.tone) setTone(res.data.tone);
    } catch (err) {
      if (latestProject.current === projectId) {
        setError(errorMessage(err, "Failed to load this project."));
      }
    } finally {
      if (latestProject.current === projectId) setLoadingScenes(false);
    }
  };

  /* ---------- first load: user + projects ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, projectsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/projects"),
        ]);

        setUser(meRes.data.user);
        setProjects(projectsRes.data);
        setLoadingProjects(false);

        if (projectsRes.data.length > 0) {
          openProject(projectsRes.data[0].id);
        }
      } catch (err) {
        setError(errorMessage(err, "Failed to load your projects."));
        setLoadingProjects(false);
      }
    };

    load();
  }, []);

  /* ---------- create a project ---------- */
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    setError("");

    try {
      const res = await api.post("/projects", { title: newTitle.trim() });

      setProjects((current) => [...current, res.data]);
      setNewTitle("");
      setShowNewProject(false);
      setStory("");
      openProject(res.data.id);
    } catch (err) {
      setError(errorMessage(err, "Could not create the project."));
    } finally {
      setCreating(false);
    }
  };

  /* ---------- delete the selected project ---------- */
  const handleDeleteProject = async () => {
    const project = projects.find((p) => p.id === selectedProject);
    if (!project) return;

    if (!window.confirm(`Delete "${project.title}" and all its scenes?`)) return;

    try {
      await api.delete(`/projects/${project.id}`);

      const remaining = projects.filter((p) => p.id !== project.id);
      setProjects(remaining);
      setStory("");
      openProject(remaining[0]?.id || "");
    } catch (err) {
      setError(errorMessage(err, "Could not delete the project."));
    }
  };

  /* ---------- generate scenes ---------- */
  const handleGenerateScenes = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!selectedProject) {
      setError("Create or select a project first.");
      return;
    }

    if (story.trim().length < MIN_STORY) {
      setError("Your story is too short. Write at least a few sentences.");
      return;
    }

    setGenerating(true);

    try {
      const res = await api.post("/scenes", {
        text: story,
        tone,
        projectId: selectedProject,
      });

      setScenes(res.data.scenes || []);
      setNotice(
        res.data.mode === "demo"
          ? `${res.data.message} (demo mode: add an AI key on the backend for real AI scenes)`
          : res.data.message
      );
    } catch (err) {
      setError(errorMessage(err, "Failed to generate scenes."));
    } finally {
      setGenerating(false);
    }
  };

  const busy = generating || loadingScenes;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">🎬 AI Studio</h1>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden text-sm text-gray-300 sm:inline">
                {user.name || user.email}
              </span>
            )}
            <button
              onClick={onLogout}
              className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm hover:bg-gray-800"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {error && <Alert onClose={() => setError("")}>{error}</Alert>}
        {notice && (
          <Alert type="success" onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}

        {/* Projects */}
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-1">
              <label htmlFor="project" className="mb-1 block text-sm font-medium text-gray-700">
                Project
              </label>

              {loadingProjects ? (
                <p className="flex items-center gap-2 py-2 text-gray-500">
                  <Spinner /> Loading projects...
                </p>
              ) : projects.length > 0 ? (
                <select
                  id="project"
                  className={`${inputClass} w-full`}
                  value={selectedProject}
                  onChange={(e) => openProject(e.target.value)}
                  disabled={generating}
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="py-2 text-gray-500">No projects yet. Create your first one.</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowNewProject((show) => !show)}
              className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
            >
              + New project
            </button>

            {selectedProject && (
              <button
                type="button"
                onClick={handleDeleteProject}
                disabled={generating}
                className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>

          {showNewProject && (
            <form onSubmit={handleCreateProject} className="mt-4 flex flex-wrap gap-3">
              <input
                className={`${inputClass} min-w-[200px] flex-1`}
                placeholder="Project name, e.g. Episode 1"
                maxLength={100}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {creating && <Spinner />}
                Create
              </button>
            </form>
          )}
        </section>

        {/* Story form */}
        <form onSubmit={handleGenerateScenes} className="rounded-xl bg-white p-5 shadow-sm">
          <label htmlFor="story" className="mb-1 block text-sm font-medium text-gray-700">
            Your story
          </label>
          <textarea
            id="story"
            placeholder="Paste or write your story here..."
            className={`${inputClass} mb-1 w-full`}
            rows={8}
            maxLength={MAX_STORY}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            disabled={generating}
          />
          <p className="mb-4 text-right text-xs text-gray-400">
            {story.length.toLocaleString()} / {MAX_STORY.toLocaleString()}
          </p>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="tone" className="mb-1 block text-sm font-medium text-gray-700">
                Tone
              </label>
              <select
                id="tone"
                className={inputClass}
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={generating}
              >
                {TONES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={busy || !selectedProject}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {generating && <Spinner />}
              {generating ? "Writing your scenes..." : scenes.length ? "Regenerate scenes" : "Generate scenes"}
            </button>

            {generating && (
              <p className="text-sm text-gray-500">This can take up to a minute.</p>
            )}
          </div>
        </form>

        {/* Scenes */}
        <section>
          {loadingScenes ? (
            <p className="flex items-center justify-center gap-2 py-10 text-gray-500">
              <Spinner /> Loading scenes...
            </p>
          ) : scenes.length > 0 ? (
            <>
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {scenes.length} scene{scenes.length === 1 ? "" : "s"}
              </h2>
              <div className="space-y-4">
                {scenes.map((scene) => (
                  <SceneCard key={scene.id || scene.sceneNumber} scene={scene} />
                ))}
              </div>
            </>
          ) : (
            selectedProject && (
              <div className="rounded-xl border-2 border-dashed border-gray-300 py-12 text-center text-gray-500">
                No scenes yet. Write a story above and click <strong>Generate scenes</strong>.
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
