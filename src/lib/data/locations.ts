import { Location } from "@/types/gameTypes";

export const locations: Record<string, Location> = {
  bunker_entrance: {
    id: "bunker_entrance",
    name: "Entrada del Búnker",
    description:
      "Emerges de la oscuridad del búnker subterráneo donde has pasado los últimos años. El aire exterior es espeso y cargado de ceniza. Las estructuras de hormigón a tu alrededor están agrietadas y cubiertas de óxido. Esta era tu prisión... y tu salvación.",
    exits: {
      norte: "wasteland_outskirts",
      este: "abandoned_checkpoint",
    },
    items: ["medkit"],
    visited: false,
  },
  wasteland_outskirts: {
    id: "wasteland_outskirts",
    name: "Perímetro del Yermo",
    description:
      "Un paisaje desolado se extiende hasta el horizonte. Arboles carbonizados se alzan como dedos acusadores hacia un cielo perpetuamente gris. El viento arrastra ceniza y el eco de una civilización muerta. Cada paso resuena con la promesa de peligro.",
    exits: {
      sur: "bunker_entrance",
      norte: "dead_forest",
      este: "ruined_highway",
      oeste: "toxic_marsh",
    },
    enemies: ["radroach", "plague_rat"],
    items: ["scrap_metal"],
    visited: false,
  },
  abandoned_checkpoint: {
    id: "abandoned_checkpoint",
    name: "Puesto de Control Abandonado",
    description:
      "Los restos de un puesto militar yacen en ruinas. Sacos de arena podridos forman barricadas inútiles. Un tanque volcado sirve como tumba de metal para sus ocupantes. Las marcas de balas en las paredes cuentan la historia de una última resistencia desesperada.",
    exits: {
      oeste: "bunker_entrance",
      norte: "ruined_highway",
    },
    enemies: ["ghoul", "feral_human"],
    items: ["rifle", "armor_vest"],
    visited: false,
  },
  dead_forest: {
    id: "dead_forest",
    name: "Bosque Muerto",
    description:
      "Un cementerio de árboles se extiende en todas direcciones. Las ramas desnudas se entrelazan formando una red de pesadilla. El suelo está cubierto de hojas negras que crujen como huesos quebrados. Algo se mueve entre las sombras.",
    exits: {
      sur: "wasteland_outskirts",
      este: "crashed_aircraft",
      oeste: "hunting_grounds",
    },
    enemies: ["mutant_dog", "shadow_lurker", "bone_collector"],
    items: ["leather_jacket", "energy_drink"],
    visited: false,
  },
  ruined_highway: {
    id: "ruined_highway",
    name: "Autopista en Ruinas",
    description:
      "Una carretera fracturada se extiende como una cicatriz en la tierra. Vehículos oxidados forman un cementerio de metal. Algunos coches aún tienen esqueletos al volante, eternos pasajeros en un viaje que nunca terminó. El asfalto está agrietado por raíces mutantes.",
    exits: {
      oeste: "wasteland_outskirts",
      sur: "abandoned_checkpoint",
      norte: "crashed_aircraft",
      este: "scavenger_camp",
    },
    enemies: ["raider", "scavenger_bot", "rust_golem"],
    items: ["pipe", "flashlight", "scrap_metal"],
    visited: false,
  },
  toxic_marsh: {
    id: "toxic_marsh",
    name: "Pantano Tóxico",
    description:
      "Un lodazal verde y burbujeante donde la vida se ha transformado en algo antinatural. Los vapores que se elevan del agua queman los pulmones. Criaturas extrañas se agitan bajo la superficie viscosa. Este lugar es una herida infectada en la carne del mundo.",
    exits: {
      este: "wasteland_outskirts",
      norte: "hunting_grounds",
    },
    enemies: ["toxic_slug", "waste_spider", "acid_spitter"],
    items: ["antibiotics", "scrap_metal"],
    visited: false,
  },
  crashed_aircraft: {
    id: "crashed_aircraft",
    name: "Aeronave Estrellada",
    description:
      "Los restos de un avión militar yacen incrustados en el suelo como una herida cicatrizada. El fuselaje está partido por la mitad, revelando asientos vacíos y equipo militar disperso. La cabina del piloto es una tumba de vidrio y metal retorcido.",
    exits: {
      oeste: "dead_forest",
      sur: "ruined_highway",
      este: "research_facility",
    },
    enemies: ["cyber_wraith", "death_crawler"],
    items: ["rifle", "medkit", "energy_drink"],
    visited: false,
  },
  hunting_grounds: {
    id: "hunting_grounds",
    name: "Terreno de Caza",
    description:
      "Un área donde los depredadores acechan a sus presas. Huesos blanqueados marcan los sitios de cacerías pasadas. El aire está impregnado del olor a muerte y descomposición. Aquí, la cadena alimentaria se ha vuelto salvaje y despiadada.",
    exits: {
      este: "dead_forest",
      sur: "toxic_marsh",
    },
    enemies: ["blood_hound", "nightmare_spawn", "void_stalker"],
    items: ["knife", "leather_jacket"],
    visited: false,
  },
  scavenger_camp: {
    id: "scavenger_camp",
    name: "Campamento de Carroñeros",
    description:
      "Los restos de un asentamiento temporal. Tiendas hechas de lona y metal corrugado se agrupan alrededor de un hogar de fuego frío. Los habitantes huyeron... o algo peor. Objetos personales yacen esparcidos, contando historias de vidas interrumpidas.",
    exits: {
      oeste: "ruined_highway",
      norte: "research_facility",
    },
    enemies: ["feral_human", "ash_walker"],
    items: ["backpack", "medkit", "scrap_metal"],
    visited: false,
  },
  research_facility: {
    id: "research_facility",
    name: "Instalación de Investigación",
    description:
      "Un complejo científico en ruinas donde se gestó la destrucción. Laboratorios abandonados contienen experimentos a medio terminar. Contenedores rotos liberaron horrores que la ciencia nunca debió crear. Los pasillos resuenan con los ecos de descubrimientos malditos.",
    exits: {
      oeste: "crashed_aircraft",
      sur: "scavenger_camp",
    },
    enemies: ["nightmare_spawn", "cyber_wraith", "metal_eater"],
    items: ["antibiotics", "scalpel", "energy_drink", "scrap_metal"],
    visited: false,
  },
};
