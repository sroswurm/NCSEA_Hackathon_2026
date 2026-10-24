import { useState, useCallback } from "react";
import { analyzeBeam } from "./beamAnalysis";
import type { BeamInput, BeamResults, SupportType, LoadType } from "./beamAnalysis";
import { DiagramChart } from "./DiagramChart";
import { BeamSketch } from "./BeamSketch";
import "./App.css";

const DEFAULTS: BeamInput = {
  span: 20,
  load: 2,
  loadType: "uniform",
  supportType: "simply-supported",
  pointLocation: 10,
  E: 29000,
  I: 200,
};

function App() {
  const [input, setInput] = useState<BeamInput>(DEFAULTS);
  const [results, setResults] = useState<BeamResults | null>(null);

  const handleChange = useCallback(
    (field: keyof BeamInput, value: string | number) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleAnalyze = useCallback(() => {
    setResults(analyzeBeam(input));
  }, [input]);

  const showPointLocation = input.loadType === "point-custom";

  return (
    <div className="app">
      <header className="app-header">
        <h1>Beam Analysis Calculator</h1>
        <p>NCSEA Hackathon 2026</p>
      </header>

      <main className="app-main">
        <section className="input-panel">
          <h2>Beam Properties</h2>

          <div className="input-group">
            <label>
              Support Type
              <select
                value={input.supportType}
                onChange={(e) => handleChange("supportType", e.target.value as SupportType)}
              >
                <option value="simply-supported">Simply Supported</option>
                <option value="cantilever">Cantilever</option>
                <option value="fixed-fixed">Fixed-Fixed</option>
              </select>
            </label>

            <label>
              Load Type
              <select
                value={input.loadType}
                onChange={(e) => handleChange("loadType", e.target.value as LoadType)}
              >
                <option value="uniform">Uniform (kips/ft)</option>
                <option value="point-center">Point Load at Center (kips)</option>
                <option value="point-custom">Point Load at Location (kips)</option>
              </select>
            </label>
          </div>

          <div className="input-group">
            <label>
              Span (ft)
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={input.span}
                onChange={(e) => handleChange("span", parseFloat(e.target.value) || 0)}
              />
            </label>

            <label>
              Load ({input.loadType === "uniform" ? "kips/ft" : "kips"})
              <input
                type="number"
                step="0.1"
                min="0"
                value={input.load}
                onChange={(e) => handleChange("load", parseFloat(e.target.value) || 0)}
              />
            </label>

            {showPointLocation && (
              <label>
                Load Location from Left (ft)
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={input.span}
                  value={input.pointLocation ?? input.span / 2}
                  onChange={(e) => handleChange("pointLocation", parseFloat(e.target.value) || 0)}
                />
              </label>
            )}
          </div>

          <h2>Section Properties</h2>
          <div className="input-group">
            <label>
              E (ksi)
              <input
                type="number"
                step="100"
                min="1"
                value={input.E}
                onChange={(e) => handleChange("E", parseFloat(e.target.value) || 0)}
              />
            </label>

            <label>
              I (in<sup>4</sup>)
              <input
                type="number"
                step="10"
                min="0.1"
                value={input.I}
                onChange={(e) => handleChange("I", parseFloat(e.target.value) || 0)}
              />
            </label>
          </div>

          <button className="analyze-btn" onClick={handleAnalyze}>
            Analyze
          </button>
        </section>

        {results && (
          <section className="results-panel">
            <h2>Results Summary</h2>
            <div className="summary-cards">
              <div className="card">
                <span className="card-label">Max Moment</span>
                <span className="card-value">{results.maxMoment.toFixed(2)} kip-ft</span>
              </div>
              <div className="card">
                <span className="card-label">Max Shear</span>
                <span className="card-value">{results.maxShear.toFixed(2)} kips</span>
              </div>
              <div className="card">
                <span className="card-label">Max Deflection</span>
                <span className="card-value">{results.maxDeflection.toFixed(4)} in</span>
              </div>
              <div className="card">
                <span className="card-label">L / Deflection</span>
                <span className="card-value">
                  L/{Math.round((input.span * 12) / results.maxDeflection)}
                </span>
              </div>
              <div className="card">
                <span className="card-label">Left Reaction</span>
                <span className="card-value">{results.reactions.left.toFixed(2)} kips</span>
              </div>
              <div className="card">
                <span className="card-label">Right Reaction</span>
                <span className="card-value">{results.reactions.right.toFixed(2)} kips</span>
              </div>
            </div>

            <BeamSketch input={input} />

            <h2>Diagrams</h2>
            <DiagramChart data={results.shearDiagram} title="Shear" unit="kips" color="#2563eb" />
            <DiagramChart data={results.momentDiagram} title="Moment" unit="kip-ft" color="#dc2626" />
            <DiagramChart data={results.deflectionDiagram} title="Deflection" unit="in" color="#16a34a" />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
