import type { DiagramPoint } from "./beamAnalysis";

interface DiagramChartProps {
  data: DiagramPoint[];
  title: string;
  unit: string;
  color: string;
  height?: number;
}

export function DiagramChart({ data, title, unit, color, height = 160 }: DiagramChartProps) {
  if (data.length === 0) return null;

  const padding = { top: 24, right: 16, bottom: 28, left: 60 };
  const width = 700;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const xMin = data[0].x;
  const xMax = data[data.length - 1].x;
  const yValues = data.map((p) => p.y);
  const yMin = Math.min(0, ...yValues);
  const yMax = Math.max(0, ...yValues);
  const yRange = yMax - yMin || 1;

  const scaleX = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * chartW;
  const scaleY = (y: number) => padding.top + chartH - ((y - yMin) / yRange) * chartH;

  const zeroY = scaleY(0);

  const pathD = data
    .map((p, i) => `${i === 0 ? "M" : "L"}${scaleX(p.x).toFixed(1)},${scaleY(p.y).toFixed(1)}`)
    .join(" ");

  const fillD = `M${scaleX(xMin).toFixed(1)},${zeroY.toFixed(1)} ${data
    .map((p) => `L${scaleX(p.x).toFixed(1)},${scaleY(p.y).toFixed(1)}`)
    .join(" ")} L${scaleX(xMax).toFixed(1)},${zeroY.toFixed(1)} Z`;

  const peakVal = yValues.reduce((a, b) => (Math.abs(b) > Math.abs(a) ? b : a), 0);
  const peakPt = data.find((p) => p.y === peakVal)!;

  const yTicks = 4;
  const tickStep = yRange / yTicks;

  return (
    <div style={{ marginBottom: 12 }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width }}>
        <text x={padding.left + chartW / 2} y={14} textAnchor="middle" fontSize="13" fontWeight="600" fill="#333">
          {title} ({unit})
        </text>

        <rect x={padding.left} y={padding.top} width={chartW} height={chartH} fill="#fafafa" stroke="#ddd" />

        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const val = yMin + i * tickStep;
          const y = scaleY(val);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="#e0e0e0" strokeWidth={0.5} />
              <text x={padding.left - 4} y={y + 4} textAnchor="end" fontSize="10" fill="#666">
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        <line x1={padding.left} y1={zeroY} x2={padding.left + chartW} y2={zeroY} stroke="#999" strokeWidth={1} />

        <path d={fillD} fill={color} opacity={0.15} />
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} />

        <circle cx={scaleX(peakPt.x)} cy={scaleY(peakPt.y)} r={3.5} fill={color} />
        <text
          x={scaleX(peakPt.x)}
          y={scaleY(peakPt.y) - 8}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill={color}
        >
          {peakVal.toFixed(2)}
        </text>

        <text x={padding.left + chartW / 2} y={height - 4} textAnchor="middle" fontSize="10" fill="#666">
          Position along span (ft)
        </text>
      </svg>
    </div>
  );
}
