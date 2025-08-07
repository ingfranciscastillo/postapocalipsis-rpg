import { SurvivorType, SurvivorTypeKey } from "@/types/gameTypes";

export const survivorTypes: Record<SurvivorTypeKey, SurvivorType> = {
  scavenger: {
    name: "Carroñero",
    description:
      "Un superviviente astuto que ha aprendido a encontrar recursos en los lugares más desolados. Especializado en supervivencia y exploración.",
    stats: {
      strength: 6,
      agility: 9,
      intelligence: 8,
      endurance: 7,
    },
    startingItems: ["knife", "backpack", "flashlight"],
  },
  soldier: {
    name: "Ex-Militar",
    description:
      "Un veterano de las guerras que precedieron al colapso. Conoce el combate y las armas, pero lucha contra los demonios de su pasado.",
    stats: {
      strength: 9,
      agility: 7,
      intelligence: 6,
      endurance: 8,
    },
    startingItems: ["rifle", "armor_vest", "medkit"],
  },
  medic: {
    name: "Médico de Campo",
    description:
      "Un sanador que ha visto demasiada muerte. Su conocimiento médico es invaluable, pero su salud mental está fragmentada.",
    stats: {
      strength: 5,
      agility: 6,
      intelligence: 10,
      endurance: 9,
    },
    startingItems: ["medkit", "scalpel", "antibiotics"],
  },
};
