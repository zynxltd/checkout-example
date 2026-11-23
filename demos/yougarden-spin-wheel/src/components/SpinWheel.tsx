import { useEffect, useRef } from "react";
import { PRIZES, TONE_COLORS } from "../prizes";

type Props = {
  rotation: number;
  spinning: boolean;
};

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 188;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function slicePath(index: number, total: number) {
  const sweep = 360 / total;
  const start = index * sweep;
  const end = start + sweep;
  const p0 = polar(CX, CY, R, start);
  const p1 = polar(CX, CY, R, end);
  const large = sweep > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${p0.x} ${p0.y} A ${R} ${R} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
}

export function SpinWheel({ rotation, spinning }: Props) {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [rotation]);

  const n = PRIZES.length;
  const sweep = 360 / n;

  return (
    <div className={`wheel ${spinning ? "is-spinning" : ""}`}>
      <div className="wheel__pointer" aria-hidden="true" />
      <div className="wheel__rim">
        <div className="wheel__disc" ref={ringRef}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="wheel__svg" role="img" aria-label="Prize wheel">
            {PRIZES.map((prize, i) => {
              const colors = TONE_COLORS[prize.tone];
              const mid = i * sweep + sweep / 2;
              const labelPos = polar(CX, CY, R * 0.62, mid);
              return (
                <g key={prize.id}>
                  <path d={slicePath(i, n)} fill={colors.fill} stroke="#102418" strokeWidth="2" />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill={colors.text}
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                    style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r="34" fill="#102418" />
            <circle cx={CX} cy={CY} r="26" fill="#f5f3ee" />
            <text
              x={CX}
              y={CY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#2f6b3a"
              fontSize="13"
              fontWeight="800"
              style={{ fontFamily: "Libre Baskerville, Georgia, serif" }}
            >
              YG
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
