// components/PlayerStatus.tsx
"use client";

import { Player } from "@/types/gameTypes";

interface PlayerStatusProps {
  player: Player | null;
  inCombat: boolean;
}

export default function PlayerStatus({ player, inCombat }: PlayerStatusProps) {
  if (!player) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="text-gray-500 text-center font-mono">
          No hay superviviente activo
        </div>
      </div>
    );
  }

  const healthPercent = (player.health / player.maxHealth) * 100;
  const staminaPercent = (player.stamina / player.maxStamina) * 100;
  const expPercent = (player.experience / player.experienceToNext) * 100;

  const getHealthColor = (percent: number) => {
    if (percent > 60) return "bg-green-500";
    if (percent > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStaminaColor = (percent: number) => {
    if (percent > 60) return "bg-blue-500";
    if (percent > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm">
      {/* Combat Status */}
      {inCombat && (
        <div className="mb-4 p-2 bg-red-900/30 border border-red-600 rounded text-center">
          <span className="text-red-400 font-bold animate-pulse">
            ⚔️ EN COMBATE ⚔️
          </span>
        </div>
      )}

      {/* Player Info */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-300">{player.name}</span>
          <span className="text-purple-400">Nv. {player.level}</span>
        </div>
        <div className="text-xs text-gray-500 capitalize mb-2">
          {player.type} • {player.location}
        </div>

        {/* Equipment */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 border-b border-gray-700 pb-1">
            EQUIPO
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">⚔️ Arma:</span>
              <span className="text-green-300 text-xs">
                {player.equippedWeapon?.name || "Ninguna"}
              </span>
            </div>
            {player.equippedWeapon && (
              <div className="text-xs text-gray-500 text-right">
                DMG: {player.equippedWeapon.damage} | DUR:{" "}
                {player.equippedWeapon.durability}/
                {player.equippedWeapon.maxDurability}
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">🛡️ Armadura:</span>
              <span className="text-blue-300 text-xs">
                {player.equippedArmor?.name || "Ninguna"}
              </span>
            </div>
            {player.equippedArmor && (
              <div className="text-xs text-gray-500 text-right">
                DEF: {player.equippedArmor.defense} | DUR:{" "}
                {player.equippedArmor.durability}/
                {player.equippedArmor.maxDurability}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Count */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">🎒 Inventario:</span>
            <span className="text-white">
              {player.inventory.length} objetos
            </span>
          </div>
        </div>
      </div>

      {/* Experience Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>EXP</span>
          <span>
            {player.experience}/{player.experienceToNext}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${expPercent}%` }}
          />
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>❤️ Salud</span>
          <span>
            {player.health}/{player.maxHealth}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`${getHealthColor(
              healthPercent
            )} h-3 rounded-full transition-all duration-300`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>

      {/* Stamina Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>⚡ Energía</span>
          <span>
            {player.stamina}/{player.maxStamina}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`${getStaminaColor(
              staminaPercent
            )} h-3 rounded-full transition-all duration-300`}
            style={{ width: `${staminaPercent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="flex justify-between">
          <span className="text-red-300">💪 Fuerza</span>
          <span className="text-white">{player.stats.strength}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-300">🏃 Agilidad</span>
          <span className="text-white">{player.stats.agility}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-300">🧠 Inteligencia</span>
          <span className="text-white">{player.stats.intelligence}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-yellow-300">🛡️ Resistencia</span>
          <span className="text-white">{player.stats.endurance}</span>
        </div>
      </div>
    </div>
  );
}
