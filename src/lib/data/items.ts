import { Item, Weapon, Armor, Consumable } from "@/types/gameTypes";

export const weapons: Record<string, Weapon> = {
  knife: {
    id: "knife",
    name: "Cuchillo Oxidado",
    description:
      "Un cuchillo carnicero manchado de sangre seca. Ha visto mejores días, pero aún puede abrir carne.",
    type: "weapon",
    damage: 8,
    durability: 75,
    maxDurability: 100,
    value: 15,
  },
  rifle: {
    id: "rifle",
    name: "Rifle de Asalto",
    description:
      "Un rifle militar deteriorado. Sus días de gloria han pasado, pero aún escupe muerte.",
    type: "weapon",
    damage: 25,
    durability: 60,
    maxDurability: 100,
    value: 150,
  },
  scalpel: {
    id: "scalpel",
    name: "Bisturí Médico",
    description:
      "Un instrumento de precisión. Diseñado para curar, pero igualmente eficaz para cortar.",
    type: "weapon",
    damage: 12,
    durability: 90,
    maxDurability: 100,
    value: 25,
  },
  pipe: {
    id: "pipe",
    name: "Tubo de Metal",
    description: "Un trozo de tubería pesada. Simple, brutal, efectivo.",
    type: "weapon",
    damage: 15,
    durability: 80,
    maxDurability: 100,
    value: 20,
  },
};

export const armor: Record<string, Armor> = {
  armor_vest: {
    id: "armor_vest",
    name: "Chaleco Antibalas",
    description:
      "Un chaleco militar desgastado. Los agujeros de bala cuentan una historia que preferirías no conocer.",
    type: "armor",
    defense: 15,
    durability: 70,
    maxDurability: 100,
    value: 100,
  },
  leather_jacket: {
    id: "leather_jacket",
    name: "Chaqueta de Cuero",
    description:
      "Una chaqueta de cuero agrietada. No detiene balas, pero puede salvar tu piel de garras y colmillos.",
    type: "armor",
    defense: 8,
    durability: 85,
    maxDurability: 100,
    value: 40,
  },
};

export const consumables: Record<string, Consumable> = {
  medkit: {
    id: "medkit",
    name: "Botiquín Médico",
    description:
      "Suministros médicos básicos. Las vendas están sucias, pero es mejor que nada.",
    type: "consumable",
    effect: "heal",
    value: 40,
    stackable: true,
    quantity: 1,
  },
  antibiotics: {
    id: "antibiotics",
    name: "Antibióticos",
    description:
      "Pastillas caducadas encontradas en una farmacia saqueada. Pueden salvar una vida... o causar una infección.",
    type: "consumable",
    effect: "heal",
    value: 25,
    stackable: true,
    quantity: 3,
  },
  energy_drink: {
    id: "energy_drink",
    name: "Bebida Energética",
    description:
      "Una lata abollada de líquido azucarado. El sabor es horrible, pero restaura energía.",
    type: "consumable",
    effect: "stamina",
    value: 30,
    stackable: true,
    quantity: 1,
  },
};

export const miscItems: Record<string, Item> = {
  backpack: {
    id: "backpack",
    name: "Mochila Militar",
    description:
      "Una mochila rasgada pero funcional. Aumenta tu capacidad de carga.",
    type: "misc",
    value: 50,
  },
  flashlight: {
    id: "flashlight",
    name: "Linterna",
    description:
      "Una linterna con batería casi agotada. La luz parpadea débilmente.",
    type: "misc",
    value: 25,
  },
  scrap_metal: {
    id: "scrap_metal",
    name: "Chatarra",
    description: "Pedazos de metal oxidado. Podría ser útil para reparaciones.",
    type: "misc",
    value: 5,
    stackable: true,
  },
};

export const allItems: Record<string, Item> = {
  ...weapons,
  ...armor,
  ...consumables,
  ...miscItems,
};
