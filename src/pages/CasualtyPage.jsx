import { useState } from "react";

import casualties from "../data/casualty.json";
import uavs from "../data/uavs.json";

import CasualtyMap from "../components/CasualtyMap";
import UavDrawer from "../components/UavDrawer";
import ControlPanel from "../components/ControlPanel";

import "./CasualtyPage.css";

export default function CasualtyPage() {
  /* ================= CASUALTY UI ================= */
  const [collapsed, setCollapsed] = useState(false);
  const [triageFilter, setTriageFilter] = useState("all");
  const [focusedId, setFocusedId] = useState(null);

  /* ================= UAV UI ================= */
  const [uavCollapsed, setUavCollapsed] = useState(false);
  const [hoveredUavId, setHoveredUavId] = useState(null);
  const [lockedUavId, setLockedUavId] = useState(null);

  const hoveredUav =
    uavs.find((u) => u.id === hoveredUavId) || null;

  const lockedUav =
    uavs.find((u) => u.id === lockedUavId) || null;

  const activeUav = lockedUav || hoveredUav;

  /* 🔥 RESET TO GLOBAL MODE */
  const clearUavSelection = () => {
    setLockedUavId(null);
    setHoveredUavId(null);
  };

  return (
    <div className="casualty-page">
      {/* ================= MAP ================= */}
      <div className="map-layer">
        <CasualtyMap
          casualties={casualties}
          focusedId={focusedId}
          triageFilter={triageFilter}
          uavs={uavs}
          focusedUavId={activeUav?.id || null}
        />
      </div>

      {/* ================= UI ================= */}
      <div className="ui-layer">
        {/* UAV DRAWER */}
        <UavDrawer
          uavs={uavs}
          collapsed={uavCollapsed}
          setCollapsed={setUavCollapsed}
          focusedUavId={hoveredUavId}
          setFocusedUavId={setHoveredUavId}
          lockedUavId={lockedUavId}
          setLockedUavId={setLockedUavId}
        />

        {/* RIGHT CASUALTY UI */}
        <div className={`right-ui ${collapsed ? "collapsed" : ""}`}>
          <div className="triage-filters">
            {["red", "yellow", "green", "black", "all"].map((t) => (
              <button
                key={t}
                className={`filter-btn ${
                  triageFilter === t ? "active" : ""
                }`}
                onClick={() => setTriageFilter(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="drawer">
            <button
              className="drawer-toggle"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "‹" : "›"}
            </button>

            <div className="casualty-list">
              {casualties
                .filter(
                  (c) =>
                    triageFilter === "all" ||
                    c.triage === triageFilter
                )
                .map((c) => (
                  <button
                    key={c.id}
                    className={`casualty-btn triage-${c.triage}`}
                    style={{ "--idColor": c.idColor }}
                    onMouseEnter={() => setFocusedId(c.id)}
                    onMouseLeave={() => setFocusedId(null)}
                  >
                    <span className="pixel-fill" />
                    <span className="label">{c.id}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* ================= CONTROL PANEL ================= */}
        <div className="bottom-safe-area">
          <ControlPanel
            uavs={uavs}
            activeUav={activeUav}
            onClearSelection={clearUavSelection}
          />
        </div>
      </div>
    </div>
  );
}
