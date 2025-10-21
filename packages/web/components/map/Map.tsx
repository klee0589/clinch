"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox public token (you'll need to add your own)
const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapProps {
  markers?: Array<{
    id: string;
    longitude: number;
    latitude: number;
    title: string;
    description?: string;
    color?: string;
  }>;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  height?: string;
  className?: string;
  onMarkerClick?: (markerId: string) => void;
}

export function Map({
  markers = [],
  center = [-98.5795, 39.8283], // Center of USA as default
  zoom = 4,
  height = "400px",
  className = "",
  onMarkerClick,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      if (!map.current) return;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = markerData.color || "#FF6B35";
      el.style.border = "3px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
      el.style.transition = "transform 0.2s";

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="color: #1a1a1a; padding: 8px;">
          <h3 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">${markerData.title}</h3>
          ${markerData.description ? `<p style="margin: 0; font-size: 12px; color: #666;">${markerData.description}</p>` : ""}
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.longitude, markerData.latitude])
        .setPopup(popup)
        .addTo(map.current);

      // Add click handler
      if (onMarkerClick) {
        el.addEventListener("click", () => {
          onMarkerClick(markerData.id);
        });
      }

      markersRef.current.push(marker);
    });

    // Fit bounds to markers if there are any
    if (markers.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach((marker) => {
        bounds.extend([marker.longitude, marker.latitude]);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
      });
    }
  }, [markers, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      className={`rounded-xl overflow-hidden shadow-2xl ${className}`}
      style={{ height }}
    />
  );
}
