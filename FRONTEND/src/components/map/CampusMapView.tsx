import React, { useEffect, useState } from "react";
import { MapPin, Search, Compass, Navigation } from "lucide-react";
import { getCampusLocations } from "@/actions/campus";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DynamicMap"), { 
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-slate-100 flex items-center justify-center relative overflow-hidden h-full min-h-[400px]">
      <div className="text-center space-y-2 z-10 bg-white/80 p-6 rounded-xl shadow-sm border border-slate-200">
        <MapPin className="h-8 w-8 text-blue-600 mx-auto animate-pulse" />
        <p className="font-medium text-slate-700">Loading Interactive Map...</p>
      </div>
    </div>
  )
});

export const CampusMapView = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [userCharacter, setUserCharacter] = useState("🔵"); // Default dot

  const characters = ["🔵", "🧑‍🎓", "🚶", "🚴", "🚗"];

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await getCampusLocations();
      if (res.success) {
        setLocations(res.data);
      }
    };
    fetchLocations();
  }, []);

  const normalizedSearch = searchTerm.toLowerCase().replace(/[\s-]/g, '');
  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().replace(/[\s-]/g, '').includes(normalizedSearch) || 
    l.building.toLowerCase().replace(/[\s-]/g, '').includes(normalizedSearch) ||
    (l.description && l.description.toLowerCase().replace(/[\s-]/g, '').includes(normalizedSearch)) ||
    (l.type && l.type.toLowerCase().replace(/[\s-]/g, '').includes(normalizedSearch))
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campus Directory & Map</h2>
          <p className="text-sm text-muted-foreground">Find cabins, labs, and facilities across the campus.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search 'HOD', 'Library'..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Interactive Map */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col h-full">
          <div className="bg-muted/30 border-b border-border p-4 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-sm">Interactive Map</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white border border-border rounded-lg px-2 py-1 gap-1">
                <span className="text-xs text-muted-foreground mr-1">You:</span>
                {characters.map(char => (
                  <button
                    key={char}
                    onClick={() => setUserCharacter(char)}
                    className={`h-6 w-6 rounded flex items-center justify-center text-sm ${userCharacter === char ? 'bg-blue-100 ring-1 ring-blue-400' : 'hover:bg-slate-100'}`}
                  >
                    {char}
                  </button>
                ))}
              </div>
              {selectedLocation && (
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="text-xs bg-white border border-border px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Reset View
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 relative z-0 min-h-0">
            <DynamicMap locations={locations} selectedLocation={selectedLocation} userCharacter={userCharacter} />
          </div>
        </div>

        {/* Directory List */}
        <div className="rounded-xl border border-border bg-card flex flex-col h-full shadow-sm overflow-hidden min-h-0">
          <div className="bg-muted/30 border-b border-border p-4 shrink-0">
            <h3 className="font-semibold text-sm">Directory</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin min-h-0">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <div 
                  key={loc.id} 
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer group ${
                    selectedLocation?.id === loc.id 
                      ? 'border-blue-500 bg-blue-50/80 shadow-sm' 
                      : 'border-slate-100 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-semibold text-sm ${selectedLocation?.id === loc.id ? 'text-blue-700' : 'group-hover:text-blue-700'}`}>
                        {loc.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{loc.building}, Floor {loc.floor}</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                      {loc.type}
                    </span>
                  </div>
                  <div className={`mt-3 flex items-center text-xs font-medium transition-opacity ${
                    selectedLocation?.id === loc.id ? 'text-blue-700 opacity-100' : 'text-blue-600 opacity-0 group-hover:opacity-100'
                  }`}>
                    <Navigation className="h-3 w-3 mr-1" /> {selectedLocation?.id === loc.id ? 'Selected' : 'View on Map'}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No locations found matching "{searchTerm}".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
