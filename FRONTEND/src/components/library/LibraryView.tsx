"use client";

import { useState, useEffect } from "react";
import { Book, FileText, Download } from "lucide-react";
import { getLibraryResources } from "@/actions/library";

export function LibraryView() {
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    getLibraryResources().then(setResources);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Digital Library & Question Bank</h2>
        <p className="text-muted-foreground">Access previous year papers and study materials.</p>
      </div>

      <div className="grid gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-center justify-between p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Book className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">{resource.title}</p>
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded text-xs">{resource.course_code}</span>
                  <span>{resource.type}</span>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Download className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
