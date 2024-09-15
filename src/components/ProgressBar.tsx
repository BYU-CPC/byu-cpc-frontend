import React from "react";
function ProgressBar({
  progress,
  className,
  display,
  fontSize,
}: {
  progress: number;
  display?: string;
  className?: string;
  fontSize?: string;
}) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const size = fontSize ?? "10px";
  return (
    <div
      className={" center " + (className ?? "")}
      style={{ position: "relative" }}
    >
      <div
        className="rounded-lg"
        style={{
          position: "absolute",
          width: `${clampedProgress * 100}%`,
          minHeight: "1px",
          backgroundColor: "var(--accent-color)",
          background: `linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-two) 100%)`,
          userSelect: "none",
          fontSize: size,
          zIndex: 0,
        }}
      >
        {display ?? ""}
      </div>
    </div>
  );
}
export default ProgressBar;
