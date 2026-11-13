import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { extractJsonData, rebuildJson } from "../utils/jsonEngine";
import "../styles/fileActions.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = JSON.parse(event.target.result);
        const extractedSegments = extractJsonData(jsonContent);

        localStorage.setItem(
          "blackCat_originalFile",
          JSON.stringify(jsonContent),
        );
        localStorage.setItem(
          "blackCat_segments",
          JSON.stringify(extractedSegments),
        );
        localStorage.setItem("blackCat_projectName", file.name);
        localStorage.setItem(
          "blackCat_projectDate",
          new Date().toLocaleDateString(),
        );

        navigate("/workspace");
      } catch (error) {
        alert("Invalid JSON file!");
      }
    };
    reader.readAsText(file);
  };
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const currentUser =
    localStorage.getItem("blackCat_currentUser") || "guest_user";
  const dbKey = `blackCat_projectsDB_${currentUser}`;
  const [savedProjects, setSavedProjects] = useState([]);

  useEffect(() => {
    let db = JSON.parse(localStorage.getItem(dbKey) || "[]");
    const activeName = localStorage.getItem("blackCat_projectName");

    if (activeName) {
      const activeSegments = JSON.parse(
        localStorage.getItem("blackCat_segments") || "[]",
      );
      const activeOriginal = JSON.parse(
        localStorage.getItem("blackCat_originalFile") || "null",
      );
      const activeDate = localStorage.getItem("blackCat_projectDate");

      const existingIndex = db.findIndex((p) => p.name === activeName);
      if (existingIndex >= 0) {
        db[existingIndex].segments = activeSegments;
      } else {
        db.push({
          id: Date.now(),
          name: activeName,
          date: activeDate,
          originalFile: activeOriginal,
          segments: activeSegments,
        });
      }
      localStorage.setItem(dbKey, JSON.stringify(db));
    }

    const formattedProjects = db.map((proj) => {
      const isCompleted =
        proj.segments.length > 0 &&
        proj.segments.every((s) => s.status.toLowerCase() === "confirmed");
      return { ...proj, status: isCompleted ? "Completed" : "In Progress" };
    });
    setSavedProjects(formattedProjects);
  }, [dbKey]);

  const handleOpenProject = (proj) => {
    localStorage.setItem("blackCat_projectName", proj.name);
    localStorage.setItem("blackCat_projectDate", proj.date);
    localStorage.setItem("blackCat_segments", JSON.stringify(proj.segments));
    localStorage.setItem(
      "blackCat_originalFile",
      JSON.stringify(proj.originalFile),
    );
    navigate("/workspace");
  };

  const handleDeleteProject = (id, name) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      let db = JSON.parse(localStorage.getItem(dbKey) || "[]");
      db = db.filter((p) => p.id !== id);
      localStorage.setItem(dbKey, JSON.stringify(db));

      if (localStorage.getItem("blackCat_projectName") === name) {
        localStorage.removeItem("blackCat_projectName");
        localStorage.removeItem("blackCat_projectDate");
        localStorage.removeItem("blackCat_segments");
        localStorage.removeItem("blackCat_originalFile");
      }
      window.location.reload();
    }
  };
  return (
    <div className="black-cat-app">
      <Header
        extraActions={
          <div style={{ display: "flex" }}>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              className="hidden-input"
              onChange={handleFileUpload}
            />
            <button
              className="btn-import"
              onClick={() => fileInputRef.current.click()}
            >
              📂 Import JSON Project
            </button>
          </div>
        }
      />
      <main className="dashboard-content">
        <div className="cat-accordion">
          <div className="cat-image-main" onClick={() => setIsOpen(!isOpen)}>
            <div className={`dashboard-bubble ${isOpen ? "show" : ""}`}>
              <span>MEOW</span>
            </div>
          </div>

          <div className={`projects-wrapper ${isOpen ? "open" : ""}`}>
            <div className="projects-inner">
              <div className="projects-list">
                {savedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="project-card"
                    onClick={() => handleOpenProject(proj)}
                  >
                    <div className="project-info">
                      <span className="project-name">{proj.name}</span>
                      <span className="project-date">{proj.date}</span>
                    </div>
                    <span
                      className={`project-status ${proj.status === "Completed" ? "status-done" : "status-pending"}`}
                    >
                      {proj.status}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(proj.id, proj.name);
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
