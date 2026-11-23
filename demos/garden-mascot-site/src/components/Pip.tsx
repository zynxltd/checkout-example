import type { ReactNode } from "react";

export type PipPose = "wave" | "water" | "dig" | "carry" | "cheer";

type Props = {
  pose?: PipPose;
  className?: string;
  label?: string;
};

/** Brand mascot — refined mark used across section themes. */
export function Pip({ pose = "wave", className = "", label = "Pip" }: Props) {
  const uid = `pip-${pose}`;
  return (
    <figure className={`pip pip--${pose} ${className}`.trim()} aria-label={label}>
      <svg viewBox="0 0 160 200" role="img" aria-hidden="true" className="pip__svg">
        <defs>
          <linearGradient id={`${uid}-leaf`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5a9e4e" />
            <stop offset="100%" stopColor="#2a6b34" />
          </linearGradient>
          <linearGradient id={`${uid}-pot`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a86b48" />
            <stop offset="100%" stopColor="#6e3f28" />
          </linearGradient>
        </defs>

        <ellipse className="pip__shadow" cx="80" cy="188" rx="36" ry="6" fill="rgba(12,28,18,0.18)" />

        <path
          className="pip__pot"
          d="M48 120h64l-7 54c-1 7-7 12-14 12H69c-7 0-13-5-14-12l-7-54z"
          fill={`url(#${uid}-pot)`}
        />
        <ellipse cx="80" cy="120" rx="36" ry="10" fill="#b87a54" />
        <ellipse cx="80" cy="117" rx="30" ry="7" fill="#2c2118" />

        <path
          className="pip__stem"
          d="M78 115c2-26 3-44 2-58"
          fill="none"
          stroke="#2a6b34"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <g className="pip__head">
          <ellipse
            cx="63"
            cy="50"
            rx="20"
            ry="14"
            fill={`url(#${uid}-leaf)`}
            transform="rotate(-26 63 50)"
          />
          <ellipse
            cx="97"
            cy="50"
            rx="20"
            ry="14"
            fill={`url(#${uid}-leaf)`}
            transform="rotate(26 97 50)"
          />
          <circle cx="80" cy="58" r="20" fill="#4e9144" />
          <circle cx="73" cy="56" r="2.6" fill="#1a2a1c" />
          <circle cx="87" cy="56" r="2.6" fill="#1a2a1c" />
          <path
            d="M73 64c3.5 3.5 10.5 3.5 14 0"
            fill="none"
            stroke="#1a2a1c"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        <g className="pip__prop">
          {pose === "wave" && (
            <g className="pip__arm-wave">
              <path
                d="M106 94c16-5 24-18 22-30"
                fill="none"
                stroke="#4e9144"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="128" cy="60" r="6" fill="#5a9e4e" />
            </g>
          )}
          {pose === "water" && (
            <g className="pip__can">
              <path d="M108 98h26l3 20H111z" fill="#3d6d82" />
              <path
                d="M134 104h14c3 0 5 2 3 5l-5 7"
                fill="none"
                stroke="#2f5568"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <g className="pip__drops">
                <circle cx="146" cy="128" r="2" fill="#8eb9cc" />
                <circle cx="141" cy="136" r="1.6" fill="#8eb9cc" />
              </g>
            </g>
          )}
          {pose === "dig" && (
            <g className="pip__spade">
              <path d="M112 102v34" stroke="#5c4634" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M105 136h14l-2 12c-1 3-4 5-7 5s-6-2-7-5l-2-12z" fill="#7d8b96" />
            </g>
          )}
          {pose === "carry" && (
            <g className="pip__basket">
              <path d="M108 110h32l-3 22H111z" fill="#b59a5c" />
              <path
                d="M112 110c5-8 20-8 26 0"
                fill="none"
                stroke="#7a6840"
                strokeWidth="2.5"
              />
              <circle cx="120" cy="118" r="3.2" fill="#c45c4a" />
              <circle cx="129" cy="117" r="2.8" fill="#d4b03a" />
            </g>
          )}
          {pose === "cheer" && (
            <g className="pip__arms-up">
              <path
                d="M56 98c-12-14-14-28-10-34"
                fill="none"
                stroke="#4e9144"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M104 98c12-14 14-28 10-34"
                fill="none"
                stroke="#4e9144"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="44" cy="60" r="5" fill="#5a9e4e" />
              <circle cx="116" cy="60" r="5" fill="#5a9e4e" />
            </g>
          )}
        </g>
      </svg>
    </figure>
  );
}

export function PipBadge({ children }: { children: ReactNode }) {
  return <p className="pip-badge">{children}</p>;
}
