import { GameCommand, CommandType, Direction } from "@/types/gameTypes";

const commandMappings: Record<string, CommandType> = {
  // Movimiento
  ir: "move",
  mover: "move",
  caminar: "move",
  viajar: "move",

  // Combate
  atacar: "attack",
  pelear: "attack",
  luchar: "attack",
  golpear: "attack",

  // Items
  usar: "use",
  consumir: "use",
  tomar: "use",
  equipar: "equip",
  vestir: "equip",
  armarse: "equip",

  // Exploración
  mirar: "look",
  observar: "look",
  examinar: "look",
  ver: "look",
  buscar: "search",
  rebuscar: "search",
  explorar: "search",
  registrar: "search",

  // Interface
  inventario: "inventory",
  mochila: "inventory",
  objetos: "inventory",
  stats: "stats",
  estadisticas: "stats",
  estado: "stats",
  nivel: "stats",

  // Combate especial
  huir: "flee",
  escapar: "flee",
  correr: "flee",
  retirarse: "flee",

  // Sistema
  ayuda: "help",
  help: "help",
  comandos: "help",
  reiniciar: "restart",
  reset: "restart",
};

const directionMappings: Record<string, Direction> = {
  norte: "norte",
  n: "norte",
  sur: "sur",
  s: "sur",
  este: "este",
  e: "este",
  oeste: "oeste",
  o: "oeste",
};

export function parseCommand(input: string): GameCommand | null {
  if (!input.trim()) return null;

  // Remover el slash inicial si existe
  const cleanInput = input.trim().replace(/^\//, "").toLowerCase();
  const parts = cleanInput.split(" ").filter((part) => part.length > 0);

  if (parts.length === 0) return null;

  const commandWord = parts[0];
  const target = parts.slice(1).join(" ");

  // Buscar el comando en el mapping
  const commandType = commandMappings[commandWord];

  if (!commandType) {
    // Si no encuentra el comando, tal vez sea una dirección directa
    const direction = directionMappings[commandWord];
    if (direction) {
      return {
        action: "move",
        target: direction,
        raw: input,
      };
    }
    return null;
  }

  // Para comandos de movimiento, convertir el target a dirección si es posible
  if (commandType === "move" && target) {
    const direction = directionMappings[target];
    return {
      action: commandType,
      target: direction || target,
      raw: input,
    };
  }

  return {
    action: commandType,
    target: target || undefined,
    raw: input,
  };
}

export function getCommandHelp(): string[] {
  return [
    "=== COMANDOS DISPONIBLES ===",
    "",
    "🚶 MOVIMIENTO:",
    "  /ir [dirección] - Moverse a una dirección (norte, sur, este, oeste)",
    "  También puedes usar: /norte, /sur, /este, /oeste",
    "",
    "⚔️ COMBATE:",
    "  /atacar - Atacar al enemigo actual",
    "  /huir - Intentar escapar del combate",
    "",
    "🎒 OBJETOS:",
    "  /inventario - Ver tu inventario",
    "  /usar [objeto] - Usar un objeto del inventario",
    "  /equipar [arma/armadura] - Equipar un objeto",
    "",
    "👁️ EXPLORACIÓN:",
    "  /mirar - Examinar tu ubicación actual",
    "  /buscar - Buscar objetos en el área",
    "",
    "📊 INFORMACIÓN:",
    "  /stats - Ver tus estadísticas",
    "  /ayuda - Mostrar esta ayuda",
    "",
    "⚙️ SISTEMA:",
    "  /reiniciar - Reiniciar el juego",
    "",
    "💡 CONSEJOS:",
    "• Puedes omitir el '/' al escribir comandos",
    "• Los comandos no distinguen mayúsculas de minúsculas",
    "• Explora cada área completamente antes de avanzar",
    "• Guarda recursos para combates difíciles",
    "• La muerte es permanente - ¡ten cuidado!",
  ];
}
