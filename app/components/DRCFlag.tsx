export default function DRCFlag({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 600"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <rect width="900" height="600" fill="#007FFF" />
      <polygon points="0,600 900,0 900,72 0,672" fill="#F7D618" />
      <polygon points="0,552 900,0 900,48 0,600" fill="#CE1126" />
      <polygon points="0,504 900,0 900,24 0,528" fill="#F7D618" />
      <g transform="translate(108,108)">
        <polygon
          points="0,-52 12.3,-17.3 49.4,-17.3 19.1,6.6 30.4,43.4 0,22 -30.4,43.4 -19.1,6.6 -49.4,-17.3 -12.3,-17.3"
          fill="#F7D618"
        />
      </g>
    </svg>
  );
}
