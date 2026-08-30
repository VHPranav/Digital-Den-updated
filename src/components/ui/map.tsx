'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

// Leaflet context to share instance among children
const LeafletContext = createContext<{ map: any; L: any } | null>(null);

export function Map({
  children,
  center = [-73.98, 40.75], // NYC center
  zoom = 11.2,
}: {
  children?: React.ReactNode;
  center?: [number, number];
  zoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<{ map: any; L: any } | null>(null);

  useEffect(() => {
    let active = true;
    let map: any = null;
    let L: any = null;

    const initMap = async () => {
      // Dynamic import to prevent SSR/Next.js pre-render errors
      L = await import('leaflet');

      // Inject Leaflet CSS dynamically if not present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!active || !containerRef.current) return;

      // Leaflet coordinates are [lat, lng], so swap center from [lng, lat]
      const latLng: [number, number] = [center[1], center[0]];

      // Create map instance
      map = L.map(containerRef.current, {
        center: latLng,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Add CartoDB Dark Matter tile layer (elegant dark vector map theme matching mapcn.dev)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
      }).addTo(map);

      setMapInstance({ map, L });
    };

    initMap();

    return () => {
      active = false;
      if (map) {
        setMapInstance(null);
        map.remove();
      }
    };
  }, [center[0], center[1], zoom]);

  return (
    <LeafletContext.Provider value={mapInstance}>
      <div ref={containerRef} className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-slate-950" />
      {mapInstance && children}
    </LeafletContext.Provider>
  );
}

export function MapRoute({
  coordinates,
  color = '#3b82f6', // Light blue matching screenshot
  width = 4,
  opacity = 0.8,
}: {
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
}) {
  const context = useContext(LeafletContext);

  useEffect(() => {
    if (!context) return;
    const { map, L } = context;

    // Check if map container is still valid and initialized
    try {
      if (!map || !map.getContainer()) return;
    } catch (e) {
      return;
    }

    // Convert [lng, lat] to Leaflet [lat, lng]
    const latLngs = coordinates.map((coord) => [coord[1], coord[0]]);

    let polyline: any = null;
    try {
      // Draw route polyline
      polyline = L.polyline(latLngs, {
        color: color,
        weight: width,
        opacity: opacity,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    } catch (e) {
      console.error('Failed to draw map route:', e);
    }

    return () => {
      if (polyline) {
        try {
          if (map && map.getContainer()) {
            polyline.remove();
          }
        } catch (e) { }
      }
    };
  }, [context, coordinates, color, width, opacity]);

  return null;
}

export function MapMarker({
  longitude,
  latitude,
  children,
}: {
  longitude: number;
  latitude: number;
  children?: React.ReactNode;
}) {
  const context = useContext(LeafletContext);
  const [markerDiv, setMarkerDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!context) return;
    const { map, L } = context;

    // Check if map container is still valid and initialized
    try {
      if (!map || !map.getContainer()) return;
    } catch (e) {
      return;
    }

    // Create custom HTML element for marker
    const el = document.createElement('div');
    setMarkerDiv(el);

    let marker: any = null;
    try {
      // Leaflet coordinate [lat, lng]
      marker = L.marker([latitude, longitude], {
        icon: L.divIcon({
          html: el,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);
    } catch (e) {
      console.error('Failed to add map marker:', e);
    }

    return () => {
      if (marker) {
        try {
          if (map && map.getContainer()) {
            marker.remove();
          }
        } catch (e) { }
      }
    };
  }, [context, longitude, latitude]);

  return markerDiv ? createPortal(children, markerDiv) : null;
}

export function MarkerContent({ children }: { children: React.ReactNode }) {
  return <div className="relative pointer-events-auto">{children}</div>;
}

export function MarkerTooltip({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-950/95 border border-white/20 text-white text-[11px] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
      {children}
    </div>
  );
}
