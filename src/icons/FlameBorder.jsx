export default function FlameBorder(props) {
  return (
    <svg x="0px" y="0px" viewBox="0 0 32 32" {...props}>
      <linearGradient id="flame" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#fa3f3f" />
        <stop offset="100%" stopColor="#ffc751" />
      </linearGradient>
      <path
        d="M 9.120765,14.007262 C 8.3934511,7.4864303 12.202476,2.9001039 19.345648,0.28827218 14.971767,5.9643197 23.074694,12.112746 23.522079,18.006238 c 1.047232,-1.787043 1.64208,-4.171432 1.75955,-7.360616 5.356129,8.402849 0.914765,22.136835 -10.872218,20.162341 -1.082223,-0.179954 -2.124456,-0.522367 -3.074213,-1.032236 -4.2988997,-2.294414 -6.8657428,-7.295633 -6.8657428,-12.071912 0,-3.044221 1.3021667,-5.761025 2.9867357,-7.9204725 0.2249425,2.1144595 0.7048196,3.6915545 1.6645741,4.2239195 z"
        id="path2"
        style={{
          fill: "none",
          stroke: "url(#flame)",
          strokeOpacity: 1,
          strokeDasharray: [2, 4],
          strokeDashoffset: 0,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}
