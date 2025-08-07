"use client";

import { useState, useRef, useEffect } from "react";

interface CommandInputProps {
  onCommand: (command: string) => void;
  disabled?: boolean;
}

export default function CommandInput({
  onCommand,
  disabled = false,
}: CommandInputProps) {
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || disabled) return;

    const command = input.trim();

    // Add to history if it's not the same as the last command
    if (command !== commandHistory[commandHistory.length - 1]) {
      setCommandHistory((prev) => [...prev, command]);
    }

    // Reset history index
    setHistoryIndex(-1);

    // Execute command
    onCommand(command);

    // Clear input
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    // Handle command history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <span className="text-green-400 font-mono font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 bg-black border border-gray-600 rounded px-3 py-2 text-green-400 font-mono focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={
            disabled
              ? "Juego no iniciado..."
              : "Escribe un comando... (ej: /help, /mirar, /ir norte)"
          }
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-4 py-2 bg-green-800 hover:bg-green-700 disabled:bg-gray-700 text-green-100 rounded font-mono transition-colors disabled:cursor-not-allowed"
        >
          ENVIAR
        </button>
      </form>

      {commandHistory.length > 0 && !disabled && (
        <div className="mt-2 text-xs text-gray-500">
          💡 Usa ↑/↓ para navegar el historial de comandos
        </div>
      )}
    </div>
  );
}
