"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fetchStudentSchedule } from "@/actions/calendar";
import { useStudent } from "@/context/StudentContext";

import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  type: string;
  location: string;
}

interface RBCEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: CalendarEvent;
}

interface CalendarViewProps {
  onAskHelpdesk: (query: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onAskHelpdesk, onNavigateTab }) => {
  const { t } = useLanguage();
  const { studentData } = useStudent();
  const student = studentData?.profile;

  const [events, setEvents] = useState<RBCEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>(Views.WEEK);

  useEffect(() => {
    async function loadSchedule() {
      if (!student?.id) return;
      setLoading(true);
      const res = await fetchStudentSchedule(student.id);
      if (res.success && res.events) {
        const mapped: RBCEvent[] = res.events.map((e: CalendarEvent) => ({
          id: e.id,
          title: e.title,
          start: new Date(e.start_time),
          end: new Date(e.end_time),
          resource: e,
        }));
        setEvents(mapped);
      }
      setLoading(false);
    }
    loadSchedule();
  }, [student?.id]);

  const eventStyleGetter = (event: RBCEvent) => {
    let backgroundColor = "#3b82f6"; // default blue
    
    switch (event.resource.type) {
      case "Lecture":
        backgroundColor = "#3b82f6"; // blue
        break;
      case "Lab":
        backgroundColor = "#10b981"; // emerald
        break;
      case "Club":
      case "Event":
        backgroundColor = "#8b5cf6"; // purple
        break;
      case "Exam":
        backgroundColor = "#ef4444"; // red
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "0.75rem",
        padding: "4px 6px",
      }
    };
  };

  return (
    <div className="@container space-y-6">
      {/* Header */}
      <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Interactive Student Schedule</h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-bold text-blue-800">
              Live Grid
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Classes, Labs, and Club Events for {student?.name || "Student"}
          </p>
        </div>

        <button
          onClick={() => onAskHelpdesk("Show me my schedule for this week")}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <CalendarIcon className="h-4 w-4" />
          <span>Ask Agent: My Schedule</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200" style={{ height: "700px" }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
            <p className="text-sm font-medium">Loading schedule...</p>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(newView) => setView(newView)}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            defaultView={Views.WEEK}
            eventPropGetter={eventStyleGetter}
            min={new Date(0, 0, 0, 8, 0, 0)} // Start day at 8 AM
            max={new Date(0, 0, 0, 20, 0, 0)} // End day at 8 PM
            components={{
              event: ({ event }) => (
                <div className="flex flex-col h-full overflow-hidden leading-tight justify-start" title={`${event.title} - ${event.resource.location}`}>
                  <span className={`font-semibold text-xs ${view === Views.MONTH ? 'truncate' : 'whitespace-normal break-words line-clamp-3'}`}>
                    {event.title}
                  </span>
                  <span className={`text-[10px] opacity-90 mt-0.5 ${view === Views.MONTH ? 'truncate' : 'whitespace-normal break-words line-clamp-2'}`}>
                    {event.resource.location}
                  </span>
                </div>
              ),
            }}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500"></div> Lecture</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div> Lab</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-500"></div> Club / Event</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500"></div> Exam</div>
      </div>
    </div>
  );
};
