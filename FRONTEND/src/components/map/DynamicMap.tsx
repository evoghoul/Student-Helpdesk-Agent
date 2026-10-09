"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, Polyline, LayerGroup } from "react-leaflet";
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
    map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.5 });
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
  userLocation?: [number, number] | null;
  routeTo?: LocationData | null;
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

const getCategoryIcon = (type: string) => {
  let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;
  let bgColor = "bg-blue-500";
  const typeLower = type.toLowerCase();
  
  if (typeLower.includes("food") || typeLower.includes("canteen") || typeLower.includes("cafeteria")) {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
    bgColor = "bg-orange-500";
  } else if (typeLower.includes("library") || typeLower.includes("reading")) {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
    bgColor = "bg-purple-500";
  } else if (typeLower.includes("academic") || typeLower.includes("lab") || typeLower.includes("classroom") || typeLower.includes("office")) {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
    bgColor = "bg-green-500";
  } else if (typeLower.includes("hostel") || typeLower.includes("dorm")) {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;
    bgColor = "bg-indigo-500";
  } else if (typeLower.includes("admin")) {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;
    bgColor = "bg-slate-700";
  } else if (typeLower.includes("facility") || typeLower.includes("bank") || typeLower.includes("atm")) {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
    bgColor = "bg-teal-500";
  }

  return L.divIcon({
    className: "bg-transparent",
    html: `<div class="relative flex h-8 w-8 items-center justify-center ${bgColor} text-white rounded-full border-2 border-white shadow-md text-sm leading-none z-10">
            ${iconSvg}
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function DynamicMap({ 
  locations, 
  selectedLocation, 
  userCharacter = "dot", 
  userLocation,
  routeTo,
  onLocationSelect 
}: DynamicMapProps) {
  // Center of Vignan University Campus
  const defaultCenter: [number, number] = [16.232820, 80.550347];
  const actualUserLocation = userLocation || defaultCenter;
  
  const mapCenter = selectedLocation
    ? [
        selectedLocation.latitude || defaultCenter[0] + (hashString(selectedLocation.id) % 100) * 0.00002, 
        selectedLocation.longitude || defaultCenter[1] + (hashString(selectedLocation.id + "1") % 100) * 0.00002
      ] as [number, number]
    : userLocation ? userLocation : defaultCenter;

  const getUserMarkerHtml = () => {
    if (userCharacter === "dot") {
      return `<div class="relative flex h-5 w-5 items-center justify-center">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border-2 border-white shadow-sm"></span>
               </div>`;
    }
    
    let userSvg = "";
    switch(userCharacter) {
      case "student": userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`; break;
      case "walk": userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 14 1 7"/><path d="M13.5 8.5 13 14h-3"/><path d="m4 10 5 1-4 6"/><path d="M16 16l-3-2V8"/><circle cx="12" cy="5" r="1"/></svg>`; break;
      case "bike": userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>`; break;
      case "car": userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`; break;
      default: userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
    }

    return `<div class="relative flex h-8 w-8 items-center justify-center bg-white text-blue-600 rounded-full border-2 border-blue-500 shadow-md text-lg z-20">
              ${userSvg}
            </div>`;
  };

  const getRouteCoordinates = (): [number, number][] => {
    if (!routeTo || !actualUserLocation) return [];
    
    const destLat = routeTo.latitude || (defaultCenter[0] + (hashString(routeTo.id) % 100) * 0.00002);
    const destLng = routeTo.longitude || (defaultCenter[1] + (hashString(routeTo.id + "1") % 100) * 0.00002);
    
    // Simulate a path by adding a midpoint to make it look like a route rather than a direct line
    const midLat = (actualUserLocation[0] + destLat) / 2 + 0.0005;
    const midLng = (actualUserLocation[1] + destLng) / 2;
    
    return [actualUserLocation, [midLat, midLng], [destLat, destLng]];
  };

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={17} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Satellite Imagery">
          <LayerGroup>
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            {/* Transparent overlay for labels (places, streets, boundaries) using minimal text-only labels */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          </LayerGroup>
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Topographic">
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {(selectedLocation || userLocation) && (
        <RecenterAutomatically lat={mapCenter[0]} lng={mapCenter[1]} />
      )}

      {/* "You are here" Marker */}
      <Marker 
        position={actualUserLocation}
        icon={L.divIcon({
          className: "bg-transparent",
          html: getUserMarkerHtml(),
          iconSize: userCharacter === "dot" ? [20, 20] : [32, 32],
          iconAnchor: userCharacter === "dot" ? [10, 10] : [16, 16],
          popupAnchor: [0, -10]
        })}
        zIndexOffset={1000}
      >
        <Popup>
          <div className="font-bold text-blue-600">You are here</div>
          <div className="text-xs text-slate-500">Current Location</div>
        </Popup>
      </Marker>
      
      {/* Draw Simulated Route */}
      {routeTo && (
        <Polyline 
          positions={getRouteCoordinates()} 
          color="#3b82f6" 
          weight={4} 
          dashArray="10, 10" 
          className="animate-pulse"
        />
      )}
      
      {locations.map((loc) => {
        const latOffset = (hashString(loc.id) % 100) * 0.00002;
        const lngOffset = (hashString(loc.id + "1") % 100) * 0.00002;
        
        const lat = loc.latitude || (defaultCenter[0] + latOffset);
        const lng = loc.longitude || (defaultCenter[1] + lngOffset);
        
        return (
          <Marker 
            key={loc.id} 
            position={[lat, lng]}
            icon={getCategoryIcon(loc.type || "")}
            eventHandlers={{
              click: () => {
                if (onLocationSelect) {
                  onLocationSelect(loc);
                }
              }
            }}
          >
            <Popup>
              <div className="text-sm min-w-[150px]">
                <p className="font-bold">{loc.name}</p>
                <p className="text-xs text-slate-600">{loc.building}, Floor {loc.floor}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 px-1.5 py-0.5 bg-slate-100 rounded inline-block">{loc.type}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
