import SegmentRow from "./SegmentRow";

export default function TranslationGrid({
  segments,
  activeId,
  targetRefs,
  onRowClick,
  onTargetChange,
  onConfirm,
  onCopy,
  onKeyDown,
}) {
  return (
    <main className="grid-wrapper">
      <div className="grid-header">
        <div className="col-index">#</div>
        <div className="col-source">
          <span>SOURCE TEXT</span>
          <span className="lang-pill">EN / LTR</span>
        </div>
        <div className="col-action">⇄</div>
        <div className="col-target">
          <span>TARGET TRANSLATION</span>
          <span className="lang-pill">AR / AUTO-BIDI</span>
        </div>
        <div className="col-status">STATUS</div>
      </div>

      <div className="grid-body">
        {segments &&
          segments.map((seg, index) => (
            <SegmentRow
              key={seg.id}
              segment={seg}
              index={index}
              isActive={seg.id === activeId}
              targetRef={(el) => {
                if (targetRefs && targetRefs.current) {
                  targetRefs.current[seg.id] = el;
                }
              }}
              onRowClick={() => onRowClick(seg.id)}
              onTargetChange={onTargetChange}
              onConfirm={onConfirm}
              onCopy={onCopy}
              onKeyDown={onKeyDown}
            />
          ))}
      </div>
    </main>
  );
}
