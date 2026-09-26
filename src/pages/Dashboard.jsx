import { useState, useEffect } from "react";
import api from "../api/axios";

function Dashboard({ setToken }) {
  const [story, setStory] = useState("");
  const [tone, setTone] = useState("Drama");
  const [scenes, setScenes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch user's projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);

        if (res.data.length > 0) {
          setSelectedProject(res.data[0].id); // default to first project
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load projects ❌");
      }
    };

    fetchProjects();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleGenerateScenes = async () => {
    if (!selectedProject) {
      alert("Please select a project first ❌");
      return;
    }

    try {
      const res = await api.post(
        "/scenes",
        { text: story, tone, projectId: selectedProject },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("RESPONSE:", res.data);

      if (Array.isArray(res.data)) {
        setScenes(res.data);
      } else if (Array.isArray(res.data.scenes)) {
        setScenes(res.data.scenes);
      } else {
        setScenes([]);
      }

      alert("Scenes Generated ✅");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to generate scenes ❌");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">AI Studio Dashboard</h1>

      {/* Select project */}
      {projects.length > 0 ? (
        <select
          className="border p-2 mb-3"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-red-500 mb-3">No projects found for your account</p>
      )}

      <textarea
        placeholder="Paste your story here..."
        className="border p-2 w-full mb-3"
        rows={6}
        value={story}
        onChange={(e) => setStory(e.target.value)}
      />

      <select
        className="border p-2 mb-3"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option>Drama</option>
        <option>Action</option>
        <option>Romance</option>
        <option>Horror</option>
      </select>

      <button
        className="bg-green-600 text-white p-2 rounded mb-3"
        onClick={handleGenerateScenes}
      >
        Generate Scenes
      </button>

      <div className="mt-6">
        {Array.isArray(scenes) &&
          scenes.map((scene) => (
            <div key={scene.id || scene.sceneNumber} className="border p-3 mb-3 rounded">
              <p>
                <strong>Scene {scene.sceneNumber}:</strong> {scene.description}
              </p>
              <p>
                <strong>Dialogue:</strong> {scene.dialogue}
              </p>
            </div>
          ))}

        <button
          className="bg-red-600 text-white p-2 rounded mb-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;