import {
  GameCommand,
  Enemy,
  Weapon,
  Armor,
  Consumable,
} from "@/types/gameTypes";
import { useGameStore } from "@/lib/store/gameStore";
import { enemies } from "@/lib/data/enemies";
import { allItems } from "@/lib/data/items";
import { getCommandHelp } from "@/utils/commandParser";

export class GameEngine {
  private store: ReturnType<typeof useGameStore>;

  constructor() {
    this.store = useGameStore.getState();
  }

  executeCommand(command: GameCommand): void {
    this.store = useGameStore.getState(); // Refresh store state

    if (!this.store.player) {
      this.store.addToLog("❌ Error: No hay jugador inicializado.");
      return;
    }

    switch (command.action) {
      case "move":
        this.handleMove(command.target);
        break;
      case "attack":
        this.handleAttack();
        break;
      case "use":
        this.handleUse(command.target);
        break;
      case "equip":
        this.handleEquip(command.target);
        break;
      case "look":
        this.handleLook();
        break;
      case "inventory":
        this.handleInventory();
        break;
      case "stats":
        this.handleStats();
        break;
      case "flee":
        this.handleFlee();
        break;
      case "help":
        this.handleHelp();
        break;
      case "search":
        this.handleSearch();
        break;
      case "restart":
        this.handleRestart();
        break;
      default:
        this.store.addToLog(`❓ Comando desconocido: ${command.raw}`);
        this.store.addToLog(
          "Escribe '/help' para ver los comandos disponibles."
        );
    }

    // Auto-save after each command
    this.store.saveGame();
  }

  private handleMove(direction?: string): void {
    if (this.store.inCombat) {
      this.store.addToLog(
        "❌ No puedes moverte durante el combate. Usa '/huir' para escapar."
      );
      return;
    }

    if (!direction) {
      this.store.addToLog(
        "❓ ¿Hacia dónde quieres ir? Especifica: norte, sur, este, oeste"
      );
      return;
    }

    const currentLocation = this.store.locations[this.store.player!.location];
    const targetLocationId = currentLocation.exits[direction];

    if (!targetLocationId) {
      this.store.addToLog(`❌ No puedes ir hacia el ${direction} desde aquí.`);
      this.store.addToLog(
        `Salidas disponibles: ${Object.keys(currentLocation.exits).join(", ")}`
      );
      return;
    }

    const targetLocation = this.store.locations[targetLocationId];

    // Move player
    this.store.updatePlayer({ location: targetLocationId });

    // Mark location as visited
    if (!targetLocation.visited) {
      this.store.locations[targetLocationId].visited = true;
    }

    this.store.addToLog(`🚶 Te diriges hacia el ${direction}...`);
    this.store.addToLog("");
    this.store.addToLog(`📍 ${targetLocation.name}`);
    this.store.addToLog(targetLocation.description);

    // Check for random encounters
    this.checkForEnemies(targetLocation);
  }

  private checkForEnemies(location: any): void {
    if (location.enemies && Math.random() < 0.4) {
      // 40% chance
      const randomEnemyId =
        location.enemies[Math.floor(Math.random() * location.enemies.length)];
      const enemyTemplate = enemies[randomEnemyId];

      if (enemyTemplate) {
        const enemy: Enemy = {
          ...enemyTemplate,
          health: enemyTemplate.maxHealth, // Reset health
        };

        this.store.setCurrentEnemy(enemy);
        this.store.setInCombat(true);

        this.store.addToLog("");
        this.store.addToLog("⚠️ ¡ENCUENTRO HOSTIL!");
        this.store.addToLog(`🔥 Un ${enemy.name} aparece ante ti.`);
        this.store.addToLog(enemy.description);
        this.store.addToLog("");
        this.store.addToLog("💀 ¡El combate ha comenzado!");
        this.store.addToLog(
          "Usa '/atacar' para luchar o '/huir' para escapar."
        );
      }
    }
  }

  private handleAttack(): void {
    if (!this.store.inCombat || !this.store.currentEnemy) {
      this.store.addToLog("❌ No hay enemigos con los que combatir.");
      return;
    }

    const player = this.store.player!;
    const enemy = this.store.currentEnemy;

    // Calculate player damage
    let playerDamage = player.stats.strength + Math.random() * 10;
    if (player.equippedWeapon) {
      playerDamage += player.equippedWeapon.damage;
      this.damageDurability(player.equippedWeapon);
    }

    // Apply enemy defense
    playerDamage = Math.max(1, Math.floor(playerDamage - enemy.defense));

    // Player attacks
    enemy.health = Math.max(0, enemy.health - playerDamage);
    this.store.addToLog(
      `⚔️ Atacas al ${enemy.name} causando ${playerDamage} puntos de daño.`
    );

    if (enemy.health <= 0) {
      // Enemy defeated
      this.handleEnemyDefeated(enemy);
      return;
    }

    this.store.addToLog(
      `💔 ${enemy.name}: ${enemy.health}/${enemy.maxHealth} HP`
    );

    // Enemy attacks back
    let enemyDamage = enemy.damage + Math.random() * 5;

    // Apply player defense
    if (player.equippedArmor) {
      enemyDamage = Math.max(1, enemyDamage - player.equippedArmor.defense);
      this.damageDurability(player.equippedArmor);
    }

    enemyDamage = Math.floor(enemyDamage);
    const newHealth = Math.max(0, player.health - enemyDamage);

    this.store.updatePlayer({ health: newHealth });
    this.store.addToLog(
      `🩸 El ${enemy.name} te ataca causando ${enemyDamage} puntos de daño.`
    );
    this.store.addToLog(`❤️ Tu salud: ${newHealth}/${player.maxHealth} HP`);

    if (newHealth <= 0) {
      this.handlePlayerDeath();
    }

    // Update enemy in store
    this.store.setCurrentEnemy(enemy);
  }

  private handleEnemyDefeated(enemy: Enemy): void {
    this.store.addToLog(`💀 Has derrotado al ${enemy.name}!`);

    // Gain experience
    const newExp = this.store.player!.experience + enemy.experience;
    this.store.addToLog(
      `✨ Obtienes ${enemy.experience} puntos de experiencia.`
    );

    this.store.updatePlayer({ experience: newExp });
    this.checkLevelUp();

    // Handle loot
    if (enemy.loot.length > 0) {
      this.store.addToLog("🎒 Encuentras los siguientes objetos:");
      enemy.loot.forEach((item) => {
        const playerInventory = [...this.store.player!.inventory, item];
        this.store.updatePlayer({ inventory: playerInventory });
        this.store.addToLog(
          `  • ${item.name}${item.quantity ? ` (x${item.quantity})` : ""}`
        );
      });
    }

    // End combat
    this.store.setCurrentEnemy(null);
    this.store.setInCombat(false);
    this.store.addToLog("");
    this.store.addToLog("✅ El combate ha terminado.");
  }

  private checkLevelUp(): void {
    const player = this.store.player!;
    if (player.experience >= player.experienceToNext) {
      const newLevel = player.level + 1;
      const expOverflow = player.experience - player.experienceToNext;
      const newExpToNext = newLevel * 100;

      // Increase stats on level up
      const statIncrease = 2;
      const healthIncrease = 15;

      this.store.updatePlayer({
        level: newLevel,
        experience: expOverflow,
        experienceToNext: newExpToNext,
        maxHealth: player.maxHealth + healthIncrease,
        health: player.health + healthIncrease,
        stats: {
          strength: player.stats.strength + statIncrease,
          agility: player.stats.agility + statIncrease,
          intelligence: player.stats.intelligence + statIncrease,
          endurance: player.stats.endurance + statIncrease,
        },
      });

      this.store.addToLog("");
      this.store.addToLog("🎉 ¡SUBISTE DE NIVEL!");
      this.store.addToLog(`📈 Nivel ${newLevel} alcanzado!`);
      this.store.addToLog(
        `💪 Todas las estadísticas aumentaron en ${statIncrease} puntos.`
      );
      this.store.addToLog(
        `❤️ Salud máxima aumentó en ${healthIncrease} puntos.`
      );
    }
  }

  private handlePlayerDeath(): void {
    this.store.addToLog("");
    this.store.addToLog("💀 HAS MUERTO");
    this.store.addToLog("");
    this.store.addToLog("El yermo ha reclamado otra víctima...");
    this.store.addToLog(
      "Tu historia termina aquí, pero otros continuarán la lucha."
    );
    this.store.addToLog("");
    this.store.addToLog(
      "🔄 Escribe '/reiniciar' para comenzar una nueva partida."
    );
  }

  private handleUse(target?: string): void {
    if (!target) {
      this.store.addToLog("❓ ¿Qué objeto quieres usar?");
      return;
    }

    const player = this.store.player!;
    const itemIndex = player.inventory.findIndex((item) =>
      item.name.toLowerCase().includes(target.toLowerCase())
    );

    if (itemIndex === -1) {
      this.store.addToLog(`❌ No tienes "${target}" en tu inventario.`);
      return;
    }

    const item = player.inventory[itemIndex];

    if (item.type === "consumable") {
      this.useConsumable(item as Consumable, itemIndex);
    } else {
      this.store.addToLog(
        `❌ No puedes usar "${item.name}". Tal vez puedas equiparlo.`
      );
    }
  }

  private useConsumable(item: Consumable, itemIndex: number): void {
    const player = this.store.player!;

    switch (item.effect) {
      case "heal":
        const newHealth = Math.min(
          player.maxHealth,
          player.health + item.value
        );
        const healed = newHealth - player.health;
        this.store.updatePlayer({ health: newHealth });
        this.store.addToLog(
          `💊 Usas ${item.name} y recuperas ${healed} puntos de salud.`
        );
        break;

      case "stamina":
        const newStamina = Math.min(
          player.maxStamina,
          player.stamina + item.value
        );
        const staminaRestored = newStamina - player.stamina;
        this.store.updatePlayer({ stamina: newStamina });
        this.store.addToLog(
          `⚡ Usas ${item.name} y recuperas ${staminaRestored} puntos de energía.`
        );
        break;
    }

    // Remove item from inventory (or decrease quantity)
    const newInventory = [...player.inventory];
    if (item.quantity && item.quantity > 1) {
      newInventory[itemIndex] = { ...item, quantity: item.quantity - 1 };
    } else {
      newInventory.splice(itemIndex, 1);
    }

    this.store.updatePlayer({ inventory: newInventory });
  }

  private handleEquip(target?: string): void {
    if (!target) {
      this.store.addToLog("❓ ¿Qué objeto quieres equipar?");
      return;
    }

    const player = this.store.player!;
    const item = player.inventory.find((item) =>
      item.name.toLowerCase().includes(target.toLowerCase())
    );

    if (!item) {
      this.store.addToLog(`❌ No tienes "${target}" en tu inventario.`);
      return;
    }

    if (item.type === "weapon") {
      this.store.updatePlayer({ equippedWeapon: item as Weapon });
      this.store.addToLog(`⚔️ Equipas ${item.name} como arma.`);
    } else if (item.type === "armor") {
      this.store.updatePlayer({ equippedArmor: item as Armor });
      this.store.addToLog(`🛡️ Te equipas ${item.name} como armadura.`);
    } else {
      this.store.addToLog(`❌ No puedes equipar "${item.name}".`);
    }
  }

  private damageDurability(equipment: Weapon | Armor): void {
    equipment.durability = Math.max(0, equipment.durability - 1);

    if (equipment.durability <= 0) {
      this.store.addToLog(`💥 Tu ${equipment.name} se ha roto por completo!`);

      // Remove broken equipment
      if (equipment.type === "weapon") {
        this.store.updatePlayer({ equippedWeapon: null });
      } else {
        this.store.updatePlayer({ equippedArmor: null });
      }

      // Remove from inventory
      const newInventory = this.store.player!.inventory.filter(
        (item) => item.id !== equipment.id
      );
      this.store.updatePlayer({ inventory: newInventory });
    } else if (equipment.durability <= equipment.maxDurability * 0.2) {
      this.store.addToLog(
        `⚠️ Tu ${equipment.name} está muy dañado y podría romperse pronto.`
      );
    }
  }

  private handleLook(): void {
    const currentLocation = this.store.locations[this.store.player!.location];

    this.store.addToLog(`📍 ${currentLocation.name}`);
    this.store.addToLog(currentLocation.description);

    if (Object.keys(currentLocation.exits).length > 0) {
      this.store.addToLog(
        `🚪 Salidas: ${Object.keys(currentLocation.exits).join(", ")}`
      );
    }

    if (this.store.inCombat && this.store.currentEnemy) {
      this.store.addToLog("");
      this.store.addToLog(
        `⚔️ Estás en combate contra: ${this.store.currentEnemy.name}`
      );
      this.store.addToLog(
        `💔 Salud del enemigo: ${this.store.currentEnemy.health}/${this.store.currentEnemy.maxHealth}`
      );
    }
  }

  private handleInventory(): void {
    const player = this.store.player!;

    this.store.addToLog("🎒 === INVENTARIO ===");

    if (player.inventory.length === 0) {
      this.store.addToLog("Tu inventario está vacío.");
    } else {
      player.inventory.forEach((item) => {
        let itemText = `• ${item.name}`;
        if (item.quantity && item.quantity > 1) {
          itemText += ` (x${item.quantity})`;
        }
        if (item.type === "weapon") {
          const weapon = item as Weapon;
          itemText += ` - Daño: ${weapon.damage}, Durabilidad: ${weapon.durability}/${weapon.maxDurability}`;
        } else if (item.type === "armor") {
          const armor = item as Armor;
          itemText += ` - Defensa: ${armor.defense}, Durabilidad: ${armor.durability}/${armor.maxDurability}`;
        }
        this.store.addToLog(itemText);
      });
    }

    this.store.addToLog("");
    this.store.addToLog(
      "⚔️ Arma equipada: " + (player.equippedWeapon?.name || "Ninguna")
    );
    this.store.addToLog(
      "🛡️ Armadura equipada: " + (player.equippedArmor?.name || "Ninguna")
    );
  }

  private handleStats(): void {
    const player = this.store.player!;

    this.store.addToLog("📊 === ESTADÍSTICAS ===");
    this.store.addToLog(`👤 Nombre: ${player.name}`);
    this.store.addToLog(`🏷️ Clase: ${player.type}`);
    this.store.addToLog(`📈 Nivel: ${player.level}`);
    this.store.addToLog(
      `✨ Experiencia: ${player.experience}/${player.experienceToNext}`
    );
    this.store.addToLog("");
    this.store.addToLog(`❤️ Salud: ${player.health}/${player.maxHealth}`);
    this.store.addToLog(`⚡ Energía: ${player.stamina}/${player.maxStamina}`);
    this.store.addToLog("");
    this.store.addToLog("🎯 === ATRIBUTOS ===");
    this.store.addToLog(`💪 Fuerza: ${player.stats.strength}`);
    this.store.addToLog(`🏃 Agilidad: ${player.stats.agility}`);
    this.store.addToLog(`🧠 Inteligencia: ${player.stats.intelligence}`);
    this.store.addToLog(`🛡️ Resistencia: ${player.stats.endurance}`);
  }

  private handleFlee(): void {
    if (!this.store.inCombat) {
      this.store.addToLog("❌ No estás en combate.");
      return;
    }

    const player = this.store.player!;
    const fleeChance = 0.6 + player.stats.agility * 0.02; // Base 60% + agility bonus

    if (Math.random() < fleeChance) {
      this.store.addToLog("🏃 ¡Logras escapar del combate!");
      this.store.setCurrentEnemy(null);
      this.store.setInCombat(false);
    } else {
      this.store.addToLog(
        "❌ No pudiste escapar. El enemigo bloquea tu huida."
      );

      // Enemy gets a free attack
      if (this.store.currentEnemy) {
        const enemyDamage = Math.floor(
          this.store.currentEnemy.damage + Math.random() * 5
        );
        const newHealth = Math.max(0, player.health - enemyDamage);

        this.store.updatePlayer({ health: newHealth });
        this.store.addToLog(
          `🩸 El ${this.store.currentEnemy.name} aprovecha tu intento fallido de huida y te ataca por ${enemyDamage} puntos de daño.`
        );

        if (newHealth <= 0) {
          this.handlePlayerDeath();
        }
      }
    }
  }

  private handleSearch(): void {
    const currentLocation = this.store.locations[this.store.player!.location];

    if (this.store.inCombat) {
      this.store.addToLog("❌ No puedes buscar durante el combate.");
      return;
    }

    if (!currentLocation.items || currentLocation.items.length === 0) {
      this.store.addToLog(
        "🔍 Buscas por el área pero no encuentras nada útil."
      );
      return;
    }

    // 70% chance to find something
    if (Math.random() < 0.7) {
      const randomItemId =
        currentLocation.items[
          Math.floor(Math.random() * currentLocation.items.length)
        ];
      const foundItem = allItems[randomItemId];

      if (foundItem) {
        const playerInventory = [...this.store.player!.inventory, foundItem];
        this.store.updatePlayer({ inventory: playerInventory });

        this.store.addToLog("🎒 ¡Encuentras algo útil!");
        this.store.addToLog(`  • ${foundItem.name}: ${foundItem.description}`);

        // Remove item from location (optional - items can be found multiple times)
        // For now, we'll allow multiple finds
      } else {
        this.store.addToLog(
          "🔍 Buscas por el área pero solo encuentras escombros inútiles."
        );
      }
    } else {
      this.store.addToLog(
        "🔍 Buscas cuidadosamente pero no encuentras nada de valor."
      );
    }
  }

  private handleHelp(): void {
    const helpLines = getCommandHelp();
    helpLines.forEach((line) => this.store.addToLog(line));
  }

  private handleRestart(): void {
    this.store.addToLog("🔄 Reiniciando el juego...");
    this.store.resetGame();
    this.store.addToLog(
      "✅ El juego ha sido reiniciado. ¡Comienza una nueva aventura!"
    );
  }
}
