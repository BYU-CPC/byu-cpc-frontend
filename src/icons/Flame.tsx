import React from "react";
export default function Flame(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg x="0px" y="0px" viewBox="0 0 32 32" {...props}>
      <linearGradient id="flame" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#fa3f3f" />
        <stop offset="100%" stopColor="#ffc751" />
      </linearGradient>
      <path
        fill="url(#flame)"
        d="M 9.120765,14.007262 C 8.3934511,7.4864303 12.202476,2.9001039 19.345648,0.28827218 14.971767,5.9643197 23.074694,12.112746 23.522079,18.006238 c 1.047232,-1.787043 1.64208,-4.171432 1.75955,-7.360616 5.356129,8.402849 0.914765,22.136835 -10.872218,20.162341 -1.082223,-0.179954 -2.124456,-0.522367 -3.074213,-1.032236 -4.2988997,-2.294414 -6.8657428,-7.295633 -6.8657428,-12.071912 0,-3.044221 1.3021667,-5.761025 2.9867357,-7.9204725 0.2249425,2.1144595 0.7048196,3.6915545 1.6645741,4.2239195 z"
      />
      <path
        fill="#fff8e6"
        fillOpacity=".2"
        d="m 13.168698,21.902675 c -1.214689,-3.136698 -1.047232,-8.202901 2.354397,-9.979946 0.025,5.823509 5.761026,6.56582 4.698798,12.781729 0.97975,-1.109716 1.474623,-2.884262 1.562101,-4.286403 1.554602,3.559089 0.334914,6.405861 -1.882018,7.85549 -6.740776,4.408872 -12.5442901,-4.528841 -8.685278,-9.427587 0.117469,1.094719 1.457127,2.784286 1.952,3.056717 z"
      />
    </svg>
  );
}