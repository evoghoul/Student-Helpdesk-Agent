"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues with Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

interface LocationData {
  id: string;
  name: string;
  building: string;
  floor: string;
  type: string;
  latitude?: number;
  longitude?: number;
}

interface DynamicMapProps {
  locations: LocationData[];
  selectedLocation?: LocationData | null;
  userCharacter?: string;
  onLocationSelect?: (location: LocationData) => void;
}

// Pseudo-random number generator for deterministic placement based on string
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

export default function DynamicMap({ locations, selectedLocation, userCharacter = "🔵", onLocationSelect }: DynamicMapProps) {
  // Center of Vignan University Campus
  const defaultCenter: [number, number] = [16.232820, 80.550347];
  
  const mapCenter = selectedLocation
    ? [
        selectedLocation.latitude || defaultCenter[0] + (hashString(selectedLocation.id) % 100) * 0.00002, 
        selectedLocation.longitude || defaultCenter[1] + (hashString(selectedLocation.id + "1") % 100) * 0.00002
      ] as [number, number]
    : defaultCenter;

  const getMarkerHtml = () => {
    if (userCharacter === "🔵") {
      return `<div class="relative flex h-5 w-5 items-center justify-center">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border-2 border-white shadow-sm"></span>
               </div>`;
    }
    return `<div class="relative flex h-8 w-8 items-center justify-center bg-white rounded-full border-2 border-blue-500 shadow-md text-lg leading-none pt-0.5">
              ${userCharacter}
            </div>`;
  };

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={18} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedLocation && (
        <RecenterAutomatically lat={mapCenter[0]} lng={mapCenter[1]} />
      )}

      {/* "You are here" Marker */}
      <Marker 
        position={defaultCenter}
        icon={L.divIcon({
          className: "bg-transparent",
          html: getMarkerHtml(),
          iconSize: userCharacter === "🔵" ? [20, 20] : [32, 32],
          iconAnchor: userCharacter === "🔵" ? [10, 10] : [16, 16]
        })}
        zIndexOffset={1000}
      >
        <Popup>
          <div className="font-bold text-blue-600">You are here</div>
          <div className="text-xs text-slate-500">Current Location</div>
        </Popup>
      </Marker>
      
      {locations.map((loc) => {
        // If mock data lacks lat/lng, offset slightly around the campus center using hash of ID
        // This spreads the markers around the campus deterministically
        const latOffset = (hashString(loc.id) % 100) * 0.00002;
        const lngOffset = (hashString(loc.id + "1") % 100) * 0.00002;
        
        const lat = loc.latitude || (defaultCenter[0] + latOffset);
        const lng = loc.longitude || (defaultCenter[1] + lngOffset);
        
        return (
          <Marker 
            key={loc.id} 
            position={[lat, lng]}
            eventHandlers={{
              click: () => {
                if (onLocationSelect) {
                  onLocationSelect(loc);
                }
              }
            }}
          >
            {/* Keeping popup for backward compatibility, but parent component will also show UI */}
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{loc.name}</p>
                <p>{loc.building}, Floor {loc.floor}</p>
                <p className="text-xs text-muted-foreground uppercase">{loc.type}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
