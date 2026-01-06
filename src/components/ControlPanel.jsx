// src/components/ControlPanel.jsx

import { useEffect, useState } from "react";
import "./ControlPanel.css";

const FLIGHT_MODES = [
  "STABILIZE",
  "ALT_HOLD",
  "LOITER",
  "GUIDED",
  "AUTO",
  "RTL",
  "LAND",
];

export default function ControlPanel({
  uavs,
  activeUav,
  onClearSelection,
}) {
  const isGlobal = !activeUav;

  const [selectedMode, setSelectedMode] = useState("");
  const [appliedMode, setAppliedMode] = useState("");

  useEffect(() => {
    if (activeUav) {
      const mode = activeUav.mode || "GUIDED";
      setSelectedMode(mode);
      setAppliedMode(mode);
    }
  }, [activeUav]);

  const modeChanged = selectedMode !== appliedMode;

  return (
    <div
      className={`control-panel ${isGlobal ? "global" : "active"}`}
      style={{ "--uavColor": activeUav?.idColor || "#5a7cff" }}
    >
      {isGlobal ? (
        <>
          <div className="uav-group">
            {uavs.map((uav) => (
              <div key={uav.id} className="uav-chip">
                <span
                  className="uav-dot"
                  style={{ background: uav.idColor }}
                />
                <span>{uav.id}</span>
              </div>
            ))}
          </div>

          <div className="global-actions">
            <button className="action-btn primary">
              START MISSION
            </button>
            <button className="action-btn danger">
              LAND ALL UAVs
            </button>
          </div>
        </>
      ) : (
        <>
          {/* UAV HEADER */}
          <div className="uav-indicator">
            <span className="uav-dot" />
            <span>{activeUav.id}</span>
          </div>

          {/* FLIGHT MODE */}
          <div className="mode-control">
            <span className="section-label">Flight Mode</span>

            <select
              className="mode-select"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              {FLIGHT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>

            <button
              className={`mode-set-btn ${
                modeChanged ? "pending" : "applied"
              }`}
              disabled={!modeChanged}
              onClick={() => setAppliedMode(selectedMode)}
            >
              SET
            </button>
          </div>

          {/* ARMING */}
          <div className="action-section">
            <span className="section-label">Arming</span>
            <div className="action-row">
              <button className="action-btn blue">ARM</button>
              <button className="action-btn orange">DISARM</button>
              <button className="action-btn red">FORCE ARM</button>
            </div>
          </div>

          {/* SYSTEM */}
          <div className="action-section">
            <span className="section-label">System</span>
            <div className="action-row">
              <button className="action-btn orange">
                PRELAUNCH REBOOT
              </button>
              <button className="action-btn orange">
                AUTOPILOT REBOOT
              </button>
              <button className="action-btn red">
                KILL MOTORS
              </button>
            </div>
          </div>

          {/* BACK */}
          <button
            className="action-btn ghost"
            onClick={onClearSelection}
          >
            ← ALL UAVs
          </button>
        </>
      )}
    </div>
  );
}
