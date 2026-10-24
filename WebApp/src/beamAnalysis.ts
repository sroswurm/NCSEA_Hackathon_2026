export type SupportType = "simply-supported" | "cantilever" | "fixed-fixed";
export type LoadType = "uniform" | "point-center" | "point-custom";

export interface BeamInput {
  span: number;         // ft
  load: number;         // kips (total for point, kips/ft for uniform)
  loadType: LoadType;
  supportType: SupportType;
  pointLocation?: number; // ft from left support (for point-custom)
  E: number;            // ksi (modulus of elasticity)
  I: number;            // in^4 (moment of inertia)
}

export interface BeamResults {
  maxMoment: number;       // kip-ft
  maxShear: number;        // kips
  maxDeflection: number;   // inches
  momentDiagram: DiagramPoint[];
  shearDiagram: DiagramPoint[];
  deflectionDiagram: DiagramPoint[];
  reactions: { left: number; right: number };
}

export interface DiagramPoint {
  x: number;
  y: number;
}

const NUM_POINTS = 200;

export function analyzeBeam(input: BeamInput): BeamResults {
  switch (input.supportType) {
    case "simply-supported":
      return analyzeSimplySupported(input);
    case "cantilever":
      return analyzeCantilever(input);
    case "fixed-fixed":
      return analyzeFixedFixed(input);
  }
}

function analyzeSimplySupported(input: BeamInput): BeamResults {
  const { span, load, loadType, E, I } = input;
  const L = span;
  const EI = E * I; // kip-in^2

  if (loadType === "uniform") {
    const w = load; // kips/ft
    const R = (w * L) / 2;

    const moment: DiagramPoint[] = [];
    const shear: DiagramPoint[] = [];
    const deflection: DiagramPoint[] = [];

    for (let i = 0; i <= NUM_POINTS; i++) {
      const x = (i / NUM_POINTS) * L;
      const V = R - w * x;
      const M = R * x - (w * x * x) / 2;
      const xIn = x * 12;
      const LIn = L * 12;
      const wIn = w / 12; // kips/in
      const d = ((wIn * xIn) / (24 * EI)) * (LIn ** 3 - 2 * LIn * xIn ** 2 + xIn ** 3);

      shear.push({ x, y: V });
      moment.push({ x, y: M });
      deflection.push({ x, y: d });
    }

    const maxDeflection = (5 * (w / 12) * (L * 12) ** 4) / (384 * EI);

    return {
      maxMoment: (w * L ** 2) / 8,
      maxShear: R,
      maxDeflection,
      momentDiagram: moment,
      shearDiagram: shear,
      deflectionDiagram: deflection,
      reactions: { left: R, right: R },
    };
  }

  // Point load
  const a = loadType === "point-center" ? L / 2 : (input.pointLocation ?? L / 2);
  const b = L - a;
  const P = load;
  const Rb = (P * a) / L;
  const Ra = P - Rb;

  const moment: DiagramPoint[] = [];
  const shear: DiagramPoint[] = [];
  const deflection: DiagramPoint[] = [];

  for (let i = 0; i <= NUM_POINTS; i++) {
    const x = (i / NUM_POINTS) * L;
    const V = x < a ? Ra : Ra - P;
    const M = x <= a ? Ra * x : Ra * x - P * (x - a);

    const xIn = x * 12;
    const aIn = a * 12;
    const bIn = b * 12;
    const LIn = L * 12;

    let d: number;
    if (x <= a) {
      d = ((P * bIn * xIn) / (6 * LIn * EI)) * (LIn ** 2 - bIn ** 2 - xIn ** 2);
    } else {
      d = ((P * aIn * (LIn - xIn)) / (6 * LIn * EI)) * (2 * LIn * (LIn - xIn) - aIn ** 2 - (LIn - xIn) ** 2);
    }

    shear.push({ x, y: V });
    moment.push({ x, y: M });
    deflection.push({ x, y: d });
  }

  const maxMoment = Ra * a;
  const maxDeflection = Math.max(...deflection.map((p) => Math.abs(p.y)));

  return {
    maxMoment,
    maxShear: Math.max(Ra, Rb),
    maxDeflection,
    momentDiagram: moment,
    shearDiagram: shear,
    deflectionDiagram: deflection,
    reactions: { left: Ra, right: Rb },
  };
}

function analyzeCantilever(input: BeamInput): BeamResults {
  const { span, load, loadType, E, I } = input;
  const L = span;
  const EI = E * I;

  if (loadType === "uniform") {
    const w = load;
    const R = w * L;

    const moment: DiagramPoint[] = [];
    const shear: DiagramPoint[] = [];
    const deflection: DiagramPoint[] = [];

    for (let i = 0; i <= NUM_POINTS; i++) {
      const x = (i / NUM_POINTS) * L;
      const V = -w * (L - x);
      const M = -(w * (L - x) ** 2) / 2;

      const xIn = x * 12;
      const LIn = L * 12;
      const wIn = w / 12;
      const d = ((wIn * xIn ** 2) / (24 * EI)) * (6 * LIn ** 2 - 4 * LIn * xIn + xIn ** 2);

      shear.push({ x, y: V });
      moment.push({ x, y: M });
      deflection.push({ x, y: d });
    }

    const maxDeflection = ((w / 12) * (L * 12) ** 4) / (8 * EI);

    return {
      maxMoment: (w * L ** 2) / 2,
      maxShear: R,
      maxDeflection,
      momentDiagram: moment,
      shearDiagram: shear,
      deflectionDiagram: deflection,
      reactions: { left: R, right: 0 },
    };
  }

  // Point load at tip (or custom location)
  const a = loadType === "point-center" ? L : (input.pointLocation ?? L);
  const P = load;

  const moment: DiagramPoint[] = [];
  const shear: DiagramPoint[] = [];
  const deflection: DiagramPoint[] = [];

  for (let i = 0; i <= NUM_POINTS; i++) {
    const x = (i / NUM_POINTS) * L;
    const V = x <= a ? -P : 0;
    const M = x <= a ? -P * (a - x) : 0;

    const xIn = x * 12;
    const aIn = a * 12;
    let d: number;
    if (x <= a) {
      d = ((P * xIn ** 2) / (6 * EI)) * (3 * aIn - xIn);
    } else {
      d = ((P * aIn ** 2) / (6 * EI)) * (3 * xIn - aIn);
    }

    shear.push({ x, y: V });
    moment.push({ x, y: M });
    deflection.push({ x, y: d });
  }

  const maxDeflection = (P * (a * 12) ** 2 * (3 * L * 12 - a * 12)) / (6 * EI);

  return {
    maxMoment: P * a,
    maxShear: P,
    maxDeflection,
    momentDiagram: moment,
    shearDiagram: shear,
    deflectionDiagram: deflection,
    reactions: { left: P, right: 0 },
  };
}

function analyzeFixedFixed(input: BeamInput): BeamResults {
  const { span, load, loadType, E, I } = input;
  const L = span;
  const EI = E * I;

  if (loadType === "uniform") {
    const w = load;
    const R = (w * L) / 2;

    const moment: DiagramPoint[] = [];
    const shear: DiagramPoint[] = [];
    const deflection: DiagramPoint[] = [];

    for (let i = 0; i <= NUM_POINTS; i++) {
      const x = (i / NUM_POINTS) * L;
      const V = R - w * x;
      const M = -(w * L ** 2) / 12 + R * x - (w * x ** 2) / 2;

      const xIn = x * 12;
      const LIn = L * 12;
      const wIn = w / 12;
      const d = ((wIn * xIn ** 2) / (24 * EI)) * (LIn - xIn) ** 2;

      shear.push({ x, y: V });
      moment.push({ x, y: M });
      deflection.push({ x, y: d });
    }

    const maxDeflection = ((w / 12) * (L * 12) ** 4) / (384 * EI);

    return {
      maxMoment: (w * L ** 2) / 12,
      maxShear: R,
      maxDeflection,
      momentDiagram: moment,
      shearDiagram: shear,
      deflectionDiagram: deflection,
      reactions: { left: R, right: R },
    };
  }

  // Point load at center (or custom)
  const a = loadType === "point-center" ? L / 2 : (input.pointLocation ?? L / 2);
  const b = L - a;
  const P = load;
  const Ra = (P * b ** 2 * (3 * a + b)) / L ** 3;
  const Rb = P - Ra;

  const Ma = -(P * a * b ** 2) / L ** 2;

  const moment: DiagramPoint[] = [];
  const shear: DiagramPoint[] = [];
  const deflection: DiagramPoint[] = [];

  for (let i = 0; i <= NUM_POINTS; i++) {
    const x = (i / NUM_POINTS) * L;
    const V = x < a ? Ra : Ra - P;
    const M = x <= a ? Ma + Ra * x : Ma + Ra * x - P * (x - a);

    const xIn = x * 12;
    const aIn = a * 12;
    const bIn = b * 12;
    const LIn = L * 12;

    let d: number;
    if (x <= a) {
      d = ((P * bIn ** 2 * xIn ** 2) / (6 * EI * LIn ** 3)) * (3 * aIn * LIn - xIn * (3 * aIn + bIn));
    } else {
      const xr = LIn - xIn;
      d = ((P * aIn ** 2 * xr ** 2) / (6 * EI * LIn ** 3)) * (3 * bIn * LIn - xr * (3 * bIn + aIn));
    }

    shear.push({ x, y: V });
    moment.push({ x, y: M });
    deflection.push({ x, y: d });
  }

  const maxMoment = Math.max(Math.abs(Ma), Math.abs(Ma + Ra * a));
  const maxDeflection = Math.max(...deflection.map((p) => Math.abs(p.y)));

  return {
    maxMoment,
    maxShear: Math.max(Ra, Rb),
    maxDeflection,
    momentDiagram: moment,
    shearDiagram: shear,
    deflectionDiagram: deflection,
    reactions: { left: Ra, right: Rb },
  };
}
