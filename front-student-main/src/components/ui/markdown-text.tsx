import React from "react";
import { cn } from "@/lib/utils";

// Renders a constrained subset of markdown used by the AI helpdesk engine:
// **bold**, `inline code`, and bullet/numbered lines. Intentionally not a
// full markdown parser — the chat responses only ever use these patterns.
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${idx++}`} className="font-semibold text-slate-900">
          {match[2]}
        </strong>
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${idx++}`}
          className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em] text-slate-800"
        >
          {match[3]}
        </code>
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export const MarkdownText: React.FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => {
  const lines = text.split("\n");

  return (
    <div className={cn("space-y-1.5", className)}>
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-1.5" />;

        const bulletMatch = line.match(/^\s*[•\-]\s+(.*)$/);
        const numberedMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);

        if (bulletMatch) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span>{renderInline(bulletMatch[1], `l${i}`)}</span>
            </div>
          );
        }

        if (numberedMatch) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="shrink-0 font-semibold text-slate-500">{numberedMatch[1]}.</span>
              <span>{renderInline(numberedMatch[2], `l${i}`)}</span>
            </div>
          );
        }

        return <div key={i}>{renderInline(line, `l${i}`)}</div>;
      })}
    </div>
  );
};
