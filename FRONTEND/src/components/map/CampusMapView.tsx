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
            <DynamicMap 
              locations={locations} 
              selectedLocation={selectedLocation} 
              userCharacter={userCharacter} 
              onLocationSelect={setSelectedLocation}
            />
          </div>
        </div>

        {/* Directory List / Details Panel */}
        <div className="rounded-xl border border-border bg-card flex flex-col h-full shadow-sm overflow-hidden min-h-0">
          {selectedLocation ? (
            // Location Details Panel
            <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
              <div className="bg-blue-600 text-white p-4 shrink-0 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                  <p className="text-blue-100 text-sm">{selectedLocation.building}, Floor {selectedLocation.floor}</p>
                </div>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="bg-blue-700/50 hover:bg-blue-700 rounded-full p-1.5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h4>
                  <p className="text-sm">{selectedLocation.description || "No description available for this location."}</p>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-border">
                  {selectedLocation.features && selectedLocation.features.length > 0 ? (
                    selectedLocation.features.map((feature: string, idx: number) => {
                      // Pick styling based on feature string
                      let btnClass = "w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ";
                      let icon = null;
                      
                      if (feature.includes('Directions')) {
                        btnClass += "bg-blue-600 hover:bg-blue-700 text-white shadow-sm";
                        icon = <Navigation className="h-4 w-4" />;
                      } else if (feature.includes('Schedule') || feature.includes('Books') || feature.includes('Menu')) {
                        btnClass += "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200";
                        icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
                      } else {
                        btnClass += "bg-white hover:bg-slate-50 text-blue-600 border border-blue-200";
                        icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
                      }

                      return (
                        <button key={idx} className={btnClass}>
                          {icon}
                          {feature}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center py-2">No special features available</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Directory List View
            <>
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
                        <Navigation className="h-3 w-3 mr-1" /> {selectedLocation?.id === loc.id ? 'Selected' : 'View Details'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No locations found matching "{searchTerm}".
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
