import { useState, useRef } from "react";
import Header from "../components/Header";
import "../styles/progress.css";
import TranslationGrid from "../components/TranslationGrid";
import CatToast from "../components/CatToast";
import { initialSegments } from "../data/mockSegments";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { extractJsonData, rebuildJson } from "../utils/jsonEngine";
import "../styles/fileActions.css";

export default function Workspace() {
  const [segments, setSegments] = useLocalStorage(
    "blackCat_segments",
    initialSegments,
  );
  const [activeId, setActiveId] = useState(1);
  const [catMeow, setCatMeow] = useState(false);
  const targetRefs = useRef({});
  const fileInputRef = useRef(null);

  const handleImport = (e) => {
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
        setSegments(extractedSegments);
        localStorage.setItem("blackCat_projectName", file.name);
        localStorage.setItem(
          "blackCat_projectDate",
          new Date().toLocaleDateString(),
        );
      } catch (error) {
        alert("Invalid JSON file!");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const originalFile = JSON.parse(
      localStorage.getItem("blackCat_originalFile"),
    );
    if (!originalFile) return;

    const translatedJson = rebuildJson(originalFile, segments);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(translatedJson, null, 2));

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "translated_project.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };
  const handleTargetChange = (id, newText) => {
    setSegments((prev) =>
      prev.map((seg) => {
        if (seg.id === id) {
          const nextStatus = newText.trim() === "" ? "untranslated" : "draft";
          return { ...seg, targetText: newText, status: nextStatus };
        }
        return seg;
      }),
    );
  };

  const handleConfirmAndNext = (id, currentIndex) => {
    const current = segments.find((seg) => seg.id === id);
    if (current && current.targetText && current.targetText.trim() !== "") {
      setCatMeow(true);
      setTimeout(() => setCatMeow(false), 2200);
    }

    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === id && seg.targetText.trim() !== ""
          ? { ...seg, status: "confirmed" }
          : seg,
      ),
    );

    const next = segments[currentIndex + 1];
    if (next) {
      setActiveId(next.id);
      targetRefs.current[next.id]?.focus();
    }
  };

  const copySourceToTarget = (id, sourceText) => {
    handleTargetChange(id, sourceText);
    targetRefs.current[id]?.focus();
  };
   const handleKeyDown = (e, id, index) => {
     if (e.ctrlKey && e.key === "Enter") {
       e.preventDefault();
       handleConfirmAndNext(id, index);
     }
  };
  const totalSegments = segments.length;
const completedSegments = segments.filter(
  (seg) => seg.status.toLowerCase() === "confirmed",
).length;

  const progressPercent =
    totalSegments === 0
      ? 0
      : Math.round((completedSegments / totalSegments) * 100);
  return (
    <div className="black-cat-app">
      <Header />
      <div className="progress-wrapper">
        <div className="action-buttons-container">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            className="hidden-input"
            onChange={handleImport}
          />
          <button
            className="btn-import"
            onClick={() => fileInputRef.current.click()}
          >
            📂 Import New File
          </button>
          <button className="btn-export" onClick={handleExport}>
            💾 Export Translation
          </button>
        </div>
        <div className="progress-stats">
          <span>Translation Progress</span>
          <span>
            {completedSegments} / {totalSegments} Segments
            <span className="progress-percent"> ({progressPercent}%)</span>
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          >
            <span className="progress-cat-emoji" title="Meow!">
              🐱
            </span>
          </div>
        </div>
      </div>
      <TranslationGrid
        segments={segments}
        activeId={activeId}
        targetRefs={targetRefs}
        onRowClick={setActiveId}
        onTargetChange={handleTargetChange}
        onConfirm={handleConfirmAndNext}
        onCopy={copySourceToTarget}
        onKeyDown={handleKeyDown}
      />
      {catMeow && <CatToast />}
    </div>
  );
}
