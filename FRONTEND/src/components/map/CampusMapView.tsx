import React, { useEffect, useState } from "react";
import { MapPin, Search, Compass, Navigation } from "lucide-react";
import { getCampusLocations } from "@/actions/campus";

export const CampusMapView = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await getCampusLocations();
      if (res.success) {
        setLocations(res.data);
      }
    };
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Placeholder */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col min-h-[400px]">
          <div className="bg-muted/30 border-b border-border p-4 flex items-center gap-2">
            <Compass className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Interactive Map</h3>
          </div>
          <div className="flex-1 bg-slate-100 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="text-center space-y-2 z-10 bg-white/80 p-6 rounded-xl shadow-sm backdrop-blur-sm border border-slate-200">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto" />
              <p className="font-medium text-slate-700">Campus Map Visualization</p>
              <p className="text-xs text-slate-500">Select a location from the directory to highlight it.</p>
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="rounded-xl border border-border bg-card flex flex-col h-[400px] shadow-sm overflow-hidden">
          <div className="bg-muted/30 border-b border-border p-4">
            <h3 className="font-semibold text-sm">Directory</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <div key={loc.id} className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-blue-700">{loc.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{loc.building}, Floor {loc.floor}</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                      {loc.type}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Navigation className="h-3 w-3 mr-1" /> Get Directions
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
