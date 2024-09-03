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
  const size = fontSize ?? "10px";
  return (
    <div
      className={" center " + (className ?? "")}
      style={{ position: "relative" }}
    >
      <div
        className=" "
        style={{
          position: "absolute",
          width: `${progress * 100}%`,
          minHeight: "1px",
          backgroundColor: "var(--accent-color)",
          background: `linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-two) 100%)`,
          color: "transparent",
          userSelect: "none",
          fontSize: size,
          zIndex: -1,
        }}
      >
        {display ?? ""}
      </div>
      <div className="w-full" style={{ fontSize: size }}>
        {display ?? ""}
      </div>
    </div>
  );
}
export default ProgressBar;
