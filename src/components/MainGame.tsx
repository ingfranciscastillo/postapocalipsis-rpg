"use client";

import { useEffect } from "react";

import { parseCommand } from "../utils/commandParser";

import GameLog from "./GameLog";
import CommandInput from "./CommandInput";
import PlayerStatus from "./PlayerStatus";
import CharacterCreation from "./CharacterCreation";
import { useGameStore } from "@/lib/store/gameStore";
import { GameEngine } from "@/lib/engine/gameEngine";

export default function MainGame() {
  const {
    player,
    currentEnemy,
    inCombat,
    gameLog,
    gameStarted,
    initializeGame,
    createPlayer,
    addToLog,
  } = useGameStore();

  const gameEngine = new GameEngine();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCommand = (commandText: string) => {
    if (!player) {
      addToLog("❌ No hay jugador activo. Crea un personaje primero.");
      return;
    }

    // Add command to log
    addToLog(`$ ${commandText}`);

    const command = parseCommand(commandText);

    if (!command) {
      addToLog(
        "❓ Comando no reconocido. Escribe '/help' para ver la lista de comandos."
      );
      return;
    }

    gameEngine.executeCommand(command);
  };

  const handleCreateCharacter = (
    name: string,
    type: "scavenger" | "soldier" | "medic"
  ) => {
    createPlayer(name, type);
  };

  // Show character creation if game hasn't started
  if (!gameStarted || !player) {
    return <CharacterCreation onCreateCharacter={handleCreateCharacter} />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-400 font-mono mb-2">
            EL YERMO ETERNO
          </h1>
          <div className="text-sm text-gray-400">
            Un RPG post-apocalíptico basado en texto • Supervivencia • Muerte
            permanente
          </div>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Player Status */}
          <div className="lg:col-span-1">
            <PlayerStatus player={player} inCombat={inCombat} />

            {/* Combat Status */}
            {inCombat && currentEnemy && (
              <div className="mt-4 bg-red-900/30 border border-red-600 rounded-lg p-4">
                <div className="text-red-400 font-bold text-center mb-2">
                  ⚔️ ENEMIGO ACTUAL ⚔️
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">
                    {currentEnemy.name}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {currentEnemy.description}
                  </div>

                  {/* Enemy Health Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>💔 Salud</span>
                      <span>
                        {currentEnemy.health}/{currentEnemy.maxHealth}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (currentEnemy.health / currentEnemy.maxHealth) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    Daño: {currentEnemy.damage} | Defensa:{" "}
                    {currentEnemy.defense}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs font-bold mb-3 border-b border-gray-700 pb-1">
                ACCIONES RÁPIDAS
              </div>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => handleCommand("/mirar")}
                  className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-cyan-400"
                >
                  👁️ Mirar alrededor
                </button>
                <button
                  onClick={() => handleCommand("/inventario")}
                  className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-blue-400"
                >
                  🎒 Ver inventario
                </button>
                <button
                  onClick={() => handleCommand("/stats")}
                  className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-purple-400"
                >
                  📊 Ver estadísticas
                </button>
                <button
                  onClick={() => handleCommand("/buscar")}
                  className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-yellow-400"
                >
                  🔍 Buscar objetos
                </button>
                {inCombat ? (
                  <>
                    <button
                      onClick={() => handleCommand("/atacar")}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-red-400"
                    >
                      ⚔️ Atacar
                    </button>
                    <button
                      onClick={() => handleCommand("/huir")}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-green-400"
                    >
                      🏃 Huir
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleCommand("/ir norte")}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-green-400"
                    >
                      🚶 Ir al Norte
                    </button>
                    <button
                      onClick={() => handleCommand("/ir sur")}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-green-400"
                    >
                      🚶 Ir al Sur
                    </button>
                    <button
                      onClick={() => handleCommand("/ir este")}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-green-400"
                    >
                      🚶 Ir al Este
                    </button>
                    <button
                      onClick={() => handleCommand("/ir oeste")}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded transition-colors text-green-400"
                    >
                      🚶 Ir al Oeste
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Game Log and Input */}
          <div className="lg:col-span-3 space-y-4">
            <GameLog log={gameLog} />
            <CommandInput
              onCommand={handleCommand}
              disabled={player?.health === 0}
            />

            {/* Help Text */}
            <div className="text-xs text-gray-500 text-center space-y-1">
              <div>
                💡 Escribe comandos como: /mirar, /ir norte, /atacar, /usar
                medkit
              </div>
              <div>
                🎯 Puedes usar los botones de la izquierda o escribir comandos
                manualmente
              </div>
              <div>⚠️ Este mundo es despiadado - la muerte es permanente</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-600">
          <div>El Yermo Eterno - RPG Post-Apocalíptico v1.0</div>
          <div>Desarrollado con Next.js • Zustand • TypeScript</div>
        </div>
      </div>
    </div>
  );
}
