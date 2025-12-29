import { useState } from "react";
import UavDrawer from "./components/UavDrawer.jsx";
import "./styles/drawer.css";

const DEFAULT_UAV_STATE = {
  selectedMode: "STABILIZE",
  lastSentMode: "STABILIZE",
};

export default function App() {
  const [activeUav, setActiveUav] = useState(null);

  // ✅ Per-UAV isolated state
  const [uavState, setUavState] = useState({
    1: { ...DEFAULT_UAV_STATE },
    2: { ...DEFAULT_UAV_STATE },
    3: { ...DEFAULT_UAV_STATE },
    4: { ...DEFAULT_UAV_STATE },
    5: { ...DEFAULT_UAV_STATE },
  });

  const updateUavState = (uavId, updates) => {
    setUavState((prev) => ({
      ...prev,
      [uavId]: {
        ...prev[uavId],
        ...updates,
      },
    }));
  };

  return (
    <div className="app-root">
      <div className="main-content">
        <h1>Main Application Area</h1>

        <div className="uav-buttons">
          {[1, 2, 3, 4, 5].map((id) => (
            <button key={id} onClick={() => setActiveUav(id)}>
              UAV {id}
            </button>
          ))}
        </div>
      </div>

      {activeUav && (
        <UavDrawer
          uavId={activeUav}
          open={true}
          onClose={() => setActiveUav(null)}
          uavData={uavState[activeUav]}
          updateUavState={updateUavState}
        />
      )}
    </div>
  );
}
