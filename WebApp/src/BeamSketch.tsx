import type { BeamInput } from "./beamAnalysis";

interface BeamSketchProps {
  input: BeamInput;
}

export function BeamSketch({ input }: BeamSketchProps) {
  const width = 700;
  const height = 140;
  const pad = { left: 60, right: 60, top: 30, bottom: 40 };
  const beamY = 70;
  const beamLeft = pad.left;
  const beamRight = width - pad.right;
  const beamLen = beamRight - beamLeft;

  const scaleX = (ft: number) => beamLeft + (ft / input.span) * beamLen;

  const triangleSupport = (cx: number) => {
    const sz = 12;
    const top = beamY + 2;
    return (
      <g>
        <polygon
          points={`${cx},${top} ${cx - sz},${top + sz * 1.5} ${cx + sz},${top + sz * 1.5}`}
          fill="none"
          stroke="#1e3a5f"
          strokeWidth={2}
        />
        <line x1={cx - sz - 4} y1={top + sz * 1.5 + 3} x2={cx + sz + 4} y2={top + sz * 1.5 + 3} stroke="#1e3a5f" strokeWidth={2} />
      </g>
    );
  };

  const fixedSupport = (cx: number, side: "left" | "right") => {
    const h = 28;
    const dir = side === "left" ? -1 : 1;
    const xLine = cx + dir * 2;
    return (
      <g>
        <line x1={xLine} y1={beamY - h / 2} x2={xLine} y2={beamY + h / 2} stroke="#1e3a5f" strokeWidth={3} />
        {Array.from({ length: 5 }, (_, i) => {
          const yy = beamY - h / 2 + i * (h / 4);
          return (
            <line
              key={i}
              x1={xLine}
              y1={yy}
              x2={xLine + dir * 10}
              y2={yy + 8}
              stroke="#1e3a5f"
              strokeWidth={1.5}
            />
          );
        })}
      </g>
    );
  };

  const renderSupports = () => {
    switch (input.supportType) {
      case "simply-supported":
        return (
          <>
            {triangleSupport(beamLeft)}
            {triangleSupport(beamRight)}
          </>
        );
      case "cantilever":
        return fixedSupport(beamLeft, "left");
      case "fixed-fixed":
        return (
          <>
            {fixedSupport(beamLeft, "left")}
            {fixedSupport(beamRight, "right")}
          </>
        );
    }
  };

  const renderLoad = () => {
    const arrowLen = 24;

    if (input.loadType === "uniform") {
      const numArrows = 16;
      const spacing = beamLen / (numArrows - 1);
      return (
        <g>
          <line
            x1={beamLeft}
            y1={beamY - arrowLen - 6}
            x2={beamRight}
            y2={beamY - arrowLen - 6}
            stroke="#dc2626"
            strokeWidth={2}
          />
          {Array.from({ length: numArrows }, (_, i) => {
            const x = beamLeft + i * spacing;
            return (
              <g key={i}>
                <line x1={x} y1={beamY - arrowLen - 6} x2={x} y2={beamY - 4} stroke="#dc2626" strokeWidth={1.5} />
                <polygon
                  points={`${x},${beamY - 4} ${x - 3},${beamY - 10} ${x + 3},${beamY - 10}`}
                  fill="#dc2626"
                />
              </g>
            );
          })}
          <text x={beamLeft + beamLen / 2} y={beamY - arrowLen - 12} textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="600">
            w = {input.load} kips/ft
          </text>
        </g>
      );
    }

    const loc =
      input.loadType === "point-center"
        ? input.span / 2
        : (input.pointLocation ?? input.span / 2);
    const px = scaleX(loc);

    return (
      <g>
        <line x1={px} y1={beamY - arrowLen - 16} x2={px} y2={beamY - 4} stroke="#dc2626" strokeWidth={2.5} />
        <polygon
          points={`${px},${beamY - 4} ${px - 5},${beamY - 14} ${px + 5},${beamY - 14}`}
          fill="#dc2626"
        />
        <text x={px} y={beamY - arrowLen - 22} textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="600">
          P = {input.load} kips
        </text>
      </g>
    );
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width }}>
        <text x={width / 2} y={14} textAnchor="middle" fontSize="13" fontWeight="600" fill="#333">
          Beam Diagram
        </text>

        <line x1={beamLeft} y1={beamY} x2={beamRight} y2={beamY} stroke="#1e3a5f" strokeWidth={4} strokeLinecap="round" />

        {renderSupports()}
        {renderLoad()}

        <line x1={beamLeft} y1={height - 12} x2={beamRight} y2={height - 12} stroke="#666" strokeWidth={0.8} />
        <line x1={beamLeft} y1={height - 16} x2={beamLeft} y2={height - 8} stroke="#666" strokeWidth={0.8} />
        <line x1={beamRight} y1={height - 16} x2={beamRight} y2={height - 8} stroke="#666" strokeWidth={0.8} />
        <text x={beamLeft + beamLen / 2} y={height - 2} textAnchor="middle" fontSize="11" fill="#666">
          L = {input.span} ft
        </text>
      </svg>
    </div>
  );
}
