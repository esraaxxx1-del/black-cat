import { detectDirection } from "../utils/bidiEngine";
export default function SegmentRow({
  segment,
  index,
  isActive,
  targetRef,
  onRowClick,
  onTargetChange,
  onConfirm,
  onCopy,
  onKeyDown
}) {
  const sourceDir = detectDirection(segment.sourceText, "ltr");
  const targetDir = detectDirection(segment.targetText, "ltr");
  const renderSourceWithPlaceholders = (text) => {
    if (!text) return "";

    const regex = /({[^}]+}|<[^>]+>)/g;
    const parts = String(text).split(regex);

    return parts.map((part, index) => {
      if (part.match(regex)) {
        return (
          <span
            key={index}
            className="code-placeholder"
            title="System Variable: Do not translate"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };
  return (
    <>
      <div
        className={`segment-row  ${isActive ? "active-row" : ""} status-${segment.status}`}
        onClick={onRowClick}
      >
        <div className="cell-index">
          <span className="paw-number">
            {" "}
            🐱 {String(segment.id).padStart(2, "0")}
          </span>
        </div>
        <div className="cell-source" dir={sourceDir}>
          <p className="source-content">
            {renderSourceWithPlaceholders(segment.sourceText)}
          </p>
          <span className="dir-indicator">{sourceDir.toUpperCase()}</span>
        </div>
        <div className="cell-action">
          <button
            type="button"
            className="copy-btn"
            title="Copy source to target"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(segment.id, segment.sourceText);
            }}
          >
            ⇄
          </button>
        </div>
        <div className="cell-target">
          <textarea
            ref={targetRef}
            dir={targetDir}
            value={segment.targetText}
            onFocus={onRowClick}
            onChange={(e) => onTargetChange(segment.id, e.target.value)}
            onKeyDown={(e) => onKeyDown(e, segment.id, index)}
            placeholder={
              targetDir === "rtl"
                ? "(للتأكيد Ctrl + Enter ...اكتب الترجمة هنا)"
                : "Type translation here..."
            }
            rows={2}
            className="target-input"
          />
          <span className="dir-indicator">{targetDir.toUpperCase()}</span>
        </div>
        <div className="cell-status">
          <button
            type="button"
            className={`status-badge badge-${segment.status}`}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm(segment.id, index);
            }}
            title="Click or press Ctrl + Enter to confirm translation"
          >
            {segment.status === "confirmed" && "✔️ confirmed"}
            {segment.status === "draft" && "✎ Draft"}
            {segment.status === "untranslated" && "❌ Untranslated"}
          </button>
        </div>
      </div>
    </>
  );
}
