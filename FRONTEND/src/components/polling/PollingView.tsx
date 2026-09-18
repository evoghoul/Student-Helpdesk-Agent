"use client";

import { useState, useEffect } from "react";
import { BarChart3, CheckCircle2 } from "lucide-react";
import { getCampusPolls } from "@/actions/polling";

export function PollingView() {
  const [polls, setPolls] = useState<any[]>([]);
  const [voted, setVoted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    getCampusPolls().then(setPolls);
  }, []);

  const handleVote = (pollId: number) => {
    setVoted(prev => ({ ...prev, [pollId]: true }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Campus Polling</h2>
        <p className="text-muted-foreground">Have your say in university decisions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {polls.map((poll) => (
          <div key={poll.id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg">{poll.question}</h3>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>

            {voted[poll.id] ? (
              <div className="flex flex-col items-center justify-center py-6 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle2 className="h-8 w-8 mb-2" />
                <p className="font-medium">Vote Recorded</p>
                <p className="text-sm text-emerald-600/80 mt-1">Thank you for your feedback!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {poll.options.map((option: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => handleVote(poll.id)}
                    className="w-full text-left px-4 py-3 rounded-lg border hover:bg-muted hover:border-primary/50 transition-colors text-sm font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
