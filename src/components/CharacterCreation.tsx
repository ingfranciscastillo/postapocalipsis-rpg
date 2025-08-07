"use client";

import { characterBackstories, storyIntroduction } from "@/lib/data/story";
import { survivorTypes } from "@/lib/data/survivorTypes";
import { SurvivorTypeKey } from "@/types/gameTypes";
import { useState } from "react";

interface CharacterCreationProps {
  onCreateCharacter: (name: string, type: SurvivorTypeKey) => void;
}

export default function CharacterCreation({
  onCreateCharacter,
}: CharacterCreationProps) {
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<SurvivorTypeKey | null>(
    null
  );
  const [showIntro, setShowIntro] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedType) {
      onCreateCharacter(name.trim(), selectedType);
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-6 font-mono">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            {storyIntroduction.map((line, index) => (
              <div key={index} className="mb-1">
                {line.startsWith("===") ? (
                  <div className="text-red-400 font-bold text-center">
                    {line}
                  </div>
                ) : (
                  <div className={line === "" ? "h-4" : "text-gray-300"}>
                    {line}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowIntro(false)}
              className="px-6 py-3 bg-red-900 hover:bg-red-800 text-red-100 rounded border border-red-600 transition-colors"
            >
              [ Continuar ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            === CREACIÓN DE SUPERVIVIENTE ===
          </h1>
          <p className="text-gray-400">
            En este mundo despiadado, tu pasado determina tu futuro. Elige
            sabiamente, porque no habrá segundas oportunidades.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div className="bg-gray-900 p-6 rounded border border-gray-700">
            <label className="block text-sm font-bold mb-4 text-gray-300">
              NOMBRE DEL SUPERVIVIENTE:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded text-green-400 focus:border-green-500 focus:outline-none"
              placeholder="Ingresa tu nombre..."
              maxLength={20}
              required
            />
          </div>

          {/* Survivor Type Selection */}
          <div className="bg-gray-900 p-6 rounded border border-gray-700">
            <label className="block text-sm font-bold mb-4 text-gray-300">
              TIPO DE SUPERVIVIENTE:
            </label>
            <div className="space-y-4">
              {(Object.keys(survivorTypes) as SurvivorTypeKey[]).map((type) => {
                const survivor = survivorTypes[type];
                const isSelected = selectedType === type;

                return (
                  <div
                    key={type}
                    className={`p-4 border rounded cursor-pointer transition-all ${
                      isSelected
                        ? "border-green-500 bg-green-900/20"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="survivorType"
                        value={type}
                        checked={isSelected}
                        onChange={() => setSelectedType(type)}
                        className="mr-3"
                      />
                      <h3
                        className={`font-bold ${
                          isSelected ? "text-green-300" : "text-gray-300"
                        }`}
                      >
                        {survivor.name}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm mb-3">
                      {survivor.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-red-300">
                        💪 Fuerza: {survivor.stats.strength}
                      </div>
                      <div className="text-blue-300">
                        🏃 Agilidad: {survivor.stats.agility}
                      </div>
                      <div className="text-purple-300">
                        🧠 Inteligencia: {survivor.stats.intelligence}
                      </div>
                      <div className="text-yellow-300">
                        🛡️ Resistencia: {survivor.stats.endurance}
                      </div>
                    </div>

                    {/* Starting Items */}
                    <div className="mt-2 text-xs text-gray-500">
                      📦 Equipo inicial: {survivor.startingItems.join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backstory */}
          {selectedType && (
            <div className="bg-gray-900 p-6 rounded border border-gray-700">
              <h3 className="text-lg font-bold text-red-400 mb-4">
                TU HISTORIA:
              </h3>
              <div className="text-gray-300 space-y-2">
                {characterBackstories[selectedType].map((line, index) => (
                  <div key={index} className={line === "" ? "h-4" : ""}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!name.trim() || !selectedType}
              className={`px-8 py-3 rounded font-bold transition-colors ${
                name.trim() && selectedType
                  ? "bg-green-800 hover:bg-green-700 text-green-100 border border-green-600"
                  : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
              }`}
            >
              [ INICIAR SUPERVIVENCIA ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
