// components/GameLog.tsx
"use client";

import { useEffect, useRef } from "react";

interface GameLogProps {
  log: string[];
}

export default function GameLog({ log }: GameLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const formatLogLine = (line: string, index: number) => {
    // Empty lines
    if (line === "") {
      return <div key={index} className="h-4" />;
    }

    // Headers with ===
    if (line.includes("===")) {
      return (
        <div key={index} className="text-red-400 font-bold text-center py-2">
          {line}
        </div>
      );
    }

    // Different types of messages based on emoji/symbols
    let className = "text-gray-300";

    if (line.includes("❌")) className = "text-red-400";
    else if (line.includes("✅") || line.includes("✓"))
      className = "text-green-400";
    else if (line.includes("⚠️") || line.includes("💀"))
      className = "text-yellow-400";
    else if (line.includes("🔥") || line.includes("⚔️"))
      className = "text-red-300";
    else if (line.includes("💊") || line.includes("❤️"))
      className = "text-green-300";
    else if (line.includes("🎒") || line.includes("📦"))
      className = "text-blue-300";
    else if (line.includes("✨") || line.includes("🎉"))
      className = "text-yellow-300";
    else if (line.includes("📍") || line.includes("🚶"))
      className = "text-cyan-400";
    else if (line.includes("💔") || line.includes("🩸"))
      className = "text-red-200";
    else if (line.includes("❓") || line.includes("💡"))
      className = "text-purple-300";

    return (
      <div key={index} className={`${className} leading-relaxed py-1`}>
        {line}
      </div>
    );
  };

  return (
    <div className="bg-black border border-gray-700 rounded-lg h-96 overflow-y-auto p-4 font-mono text-sm">
      <div className="space-y-1">
        {log.length === 0 ? (
          <div className="text-gray-500 italic">
            El terminal está esperando...
          </div>
        ) : (
          log.map((line, index) => formatLogLine(line, index))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
