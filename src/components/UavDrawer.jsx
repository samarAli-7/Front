import { useState, useRef } from "react";

const FLIGHT_MODES = [
  "STABILIZE",
  "ALT_HOLD",
  "LOITER",
  "AUTO",
  "GUIDED",
  "RTL",
];

export default function UavDrawer({
  uavId,
  open,
  onClose,
  uavData,
  updateUavState,
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [height, setHeight] = useState(300);

  const resizeRef = useRef(null);

  if (!open) return null;

  const { selectedMode, lastSentMode } = uavData;

  const sendCommand = (type, payload = {}) => {
    console.log({
      type,
      uav_id: uavId,
      payload,
      timestamp: Date.now(),
    });
  };

  const handleSetMode = () => {
    sendCommand("SET_MODE", { mode: selectedMode });
    updateUavState(uavId, { lastSentMode: selectedMode });
  };

  /* ================= HEIGHT RESIZE ================= */

  const startResize = (e) => {
    if (fullscreen || collapsed) return;

    resizeRef.current = {
      startY: e.clientY,
      startHeight: height,
    };

    document.addEventListener("mousemove", onResize);
    document.addEventListener("mouseup", stopResize);
  };

  const onResize = (e) => {
    if (!resizeRef.current) return;

    const delta = resizeRef.current.startY - e.clientY;
    const newHeight = resizeRef.current.startHeight + delta;

    setHeight(
      Math.max(200, Math.min(newHeight, window.innerHeight * 0.85))
    );
  };

  const stopResize = () => {
    resizeRef.current = null;
    document.removeEventListener("mousemove", onResize);
    document.removeEventListener("mouseup", stopResize);
  };

  return (
    <div
      className={`uav-drawer ${
        fullscreen ? "fullscreen" : ""
      } ${collapsed ? "collapsed" : ""}`}
      style={!fullscreen && !collapsed ? { height } : {}}
    >
      {!collapsed && (
        <div className="resize-top" onMouseDown={startResize} />
      )}

      {/* HEADER */}
      <div className="drawer-header">
        <span className="drawer-title">UAV {uavId}</span>

        <div className="drawer-actions">
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "▲" : "▼"}
          </button>

          <button onClick={() => setFullscreen(!fullscreen)}>
            {fullscreen ? "🗗" : "🗖"}
          </button>

          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {!collapsed && (
        <div className="drawer-body">
          <div className="drawer-content">
            {/* MODE CONTROL */}
            <div className="control-row">
              <label>Flight Mode</label>

              <select
                value={selectedMode}
                onChange={(e) =>
                  updateUavState(uavId, {
                    selectedMode: e.target.value,
                  })
                }
              >
                {FLIGHT_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <button
                className={`set-btn ${
                  selectedMode !== lastSentMode ? "pending" : "synced"
                }`}
                onClick={handleSetMode}
              >
                SET
              </button>
            </div>

            {/* ARMING */}
            <div className="section">
              <h4>Arming</h4>
              <div className="button-row">
                <button className="btn-arm" onClick={() => sendCommand("ARM")}>
                  ARM
                </button>
                <button
                  className="btn-disarm"
                  onClick={() => sendCommand("DISARM")}
                >
                  DISARM
                </button>
                <button
                  className="btn-force"
                  onClick={() => sendCommand("FORCE_ARM")}
                >
                  FORCE ARM
                </button>
              </div>
            </div>

            {/* SYSTEM */}
            <div className="section">
              <h4>System</h4>
              <div className="button-row">
                <button
                  className="btn-reboot"
                  onClick={() => sendCommand("REBOOT_PRELAUNCH")}
                >
                  PRELAUNCH REBOOT
                </button>
                <button
                  className="btn-reboot"
                  onClick={() => sendCommand("REBOOT_AUTOPILOT")}
                >
                  AUTOPILOT REBOOT
                </button>
                <button
                  className="btn-kill"
                  onClick={() => sendCommand("KILL_MOTORS")}
                >
                  KILL MOTORS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
    