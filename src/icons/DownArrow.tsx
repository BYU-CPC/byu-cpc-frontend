import React from "react";
export default function DownArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg x="0px" y="0px" viewBox="0 0 8.4666666 8.4666666" {...props}>
      <path
        d="M 7.9744152,2.3628024 4.2333334,6.1038842 0.49225151,2.3628024"
        style={{
          fill: "none",
          stroke: props.fill ?? "#000",
          strokeWidth: 1,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
      />
    </svg>
  );
}
