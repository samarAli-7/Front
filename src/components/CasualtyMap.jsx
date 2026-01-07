import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "./CasualtyMap.css";
import UavLayer from "./UavLayer";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXl1c2gxMDIiLCJhIjoiY2xycTRtZW4xMDE0cTJtbno5dnU0dG12eCJ9.L9xmYztXX2yOahZoKDBr6g";

export default function CasualtyMap({
  casualties = [],
  focusedId = null,
  triageFilter = "all",

  /* UAV support */
  uavs = [],
  focusedUavId = null,
}) {
  const mapRef = useRef(null);
  const mapRefInstance = useRef(null);
  const markers = useRef({});

  const [mapReady, setMapReady] = useState(false);

  /* =========================
     INIT MAP (SAFE)
  ========================= */

  useEffect(() => {
    if (mapRefInstance.current || !mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [77.1175, 28.7488],
      zoom: 16,
    });

    mapRefInstance.current = map;

    map.on("load", () => {
      setMapReady(true);
    });

    return () => {
      map.remove();
      mapRefInstance.current = null;
    };
  }, []);

  /* =========================
     CREATE CASUALTY MARKERS
  ========================= */

  useEffect(() => {
    if (!mapReady) return;

    const map = mapRefInstance.current;

    casualties.forEach((c) => {
      if (markers.current[c.id]) return;

      const el = document.createElement("div");
      el.className = `casualty-marker triage-${c.triage}`;
      el.style.setProperty("--idColor", c.idColor);

      el.innerHTML = `
        <div class="waves">
          <span class="wave"></span>
          <span class="wave"></span>
        </div>
        <div class="dot">${c.id.replace("C", "")}</div>
        <div class="focus-arrows">
          <span class="arrow up"></span>
          <span class="arrow right"></span>
          <span class="arrow down"></span>
          <span class="arrow left"></span>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([c.lng, c.lat])
        .addTo(map);

      markers.current[c.id] = { marker, el };
    });
  }, [casualties, mapReady]);

  /* =========================
     FILTER + FOCUS
  ========================= */

  useEffect(() => {
    if (!mapReady) return;

    const map = mapRefInstance.current;

    Object.entries(markers.current).forEach(([id, { el }]) => {
      el.classList.remove("focused", "hidden");

      const casualty = casualties.find((c) => c.id === id);
      if (!casualty) return;

      if (triageFilter !== "all" && casualty.triage !== triageFilter) {
        el.classList.add("hidden");
        return;
      }

      if (focusedId && id !== focusedId) {
        el.classList.add("hidden");
      }

      if (focusedId === id) {
        el.classList.add("focused");
      }
    });

    if (!focusedId) {
      map.flyTo({
        center: [77.1175, 28.7488],
        zoom: 16,
        speed: 1.1,
      });
      return;
    }

    const c = casualties.find((c) => c.id === focusedId);
    if (!c) return;

    map.flyTo({
      center: [c.lng, c.lat],
      zoom: 19,
      speed: 0.9,
      curve: 1.3,
      essential: true,
    });
  }, [focusedId, triageFilter, casualties, mapReady]);

  /* =========================
     RENDER
  ========================= */

  return (
    <>
      <div ref={mapRef} className="map-container" />

      {mapReady && uavs.length > 0 && (
        <UavLayer
          map={mapRefInstance.current}
          uavs={uavs}
          focusedUavId={focusedUavId}
        />
      )}
    </>
  );
}
