"use client";

import { useState, useEffect } from "react";
import { Bus, MapPin, Clock } from "lucide-react";
import { getTransportRoutes } from "@/actions/transport";

export function TransportView() {
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    getTransportRoutes().then(setRoutes);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Smart Transportation</h2>
        <p className="text-muted-foreground">Live university bus tracking and ETAs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {routes.map((route) => (
          <div key={route.id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Bus className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{route.route_name}</h3>
                  <p className="text-xs text-muted-foreground">Driver: {route.driver_name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold">
                  <Clock className="h-4 w-4" />
                  <span>{route.eta_minutes} min</span>
                </div>
                <p className="text-xs text-muted-foreground">ETA to campus</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Currently at: <span className="font-medium">{route.current_location}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
