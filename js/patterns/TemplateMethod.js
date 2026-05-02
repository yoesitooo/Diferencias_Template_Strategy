/**
 * ============================================================
 * PATRÓN: TEMPLATE METHOD
 * ============================================================
 * Define el ESQUELETO de un algoritmo en la clase base.
 * Las subclases implementan los pasos específicos sin cambiar
 * la estructura general del algoritmo.
 *
 * El método assembleRobot() es el "Template Method":
 * - Llama a pasos concretos (comunes a todos los robots)
 * - Llama a pasos abstractos (que cada subclase sobreescribe)
 * ============================================================
 */

class RobotFactory {
    // ★ EL TEMPLATE METHOD — define el flujo fijo, inmutable
    async assembleRobot(x, y, canvas, onStep) {
        const robot = new Robot(x, y, canvas);

        // Paso 1: Común a TODOS los robots (concreto)
        await this._step(robot, () => this.prepareChassis(robot), 'Paso 1: Preparando chasis reforzado...', '#38bdf8', onStep);

        // Paso 2: Común a TODOS los robots (concreto)
        await this._step(robot, () => this.installCore(robot), 'Paso 2: Instalando núcleo de energía central...', '#818cf8', onStep);

        // Paso 3: ABSTRACTO — cada subclase implementa esto de forma diferente
        await this._step(robot, () => this.installSpecialModule(robot), `Paso 3: ${this.getModuleName()}`, this.getModuleColor(), onStep);

        // Paso 4: Común a TODOS los robots (concreto)
        await this._step(robot, () => this.finalize(robot), 'Paso 4: Robot ensamblado y operativo ✓', '#10b981', onStep);

        return robot;
    }

    // ─── Pasos Concretos (heredados tal cual) ───────────────
    prepareChassis(robot) {
        robot.buildStage = 1;
        robot.parts.body = true;
    }

    installCore(robot) {
        robot.buildStage = 2;
        robot.parts.core = true;
    }

    finalize(robot) {
        robot.buildStage = 4;
        robot.isReady = true;
    }

    // ─── Paso Abstracto (DEBE ser sobreescrito) ─────────────
    installSpecialModule(robot) {
        throw new Error(`[Template Method] El método installSpecialModule() DEBE ser implementado por ${this.constructor.name}`);
    }

    getModuleName() { return 'Módulo genérico'; }
    getModuleColor() { return '#94a3b8'; }

    // ─── Helper de animación por pasos ──────────────────────
    _step(robot, action, message, color, onStep) {
        action();
        if (onStep) onStep(message, color, robot);
        return new Promise(resolve => setTimeout(resolve, 600));
    }
}

// ═══════════════════════════════════════════════════════════
// SUBCLASE A: CombatBot
// Sobreescribe installSpecialModule() con módulo de ataque
// ═══════════════════════════════════════════════════════════
class CombatRobotFactory extends RobotFactory {
    installSpecialModule(robot) {
        robot.buildStage = 3;
        robot.type = 'COMBAT';
        robot.color = '#ef4444';
        robot.accentColor = '#fca5a5';
        robot.parts.weapon = 'LASER';
        robot.label = 'CombatBot';
    }
    getModuleName() { return 'Instalando Cañón Láser de Pulso [COMBATE]'; }
    getModuleColor() { return '#ef4444'; }
}

// ═══════════════════════════════════════════════════════════
// SUBCLASE B: RepairBot
// Sobreescribe installSpecialModule() con módulo de reparación
// ═══════════════════════════════════════════════════════════
class RepairRobotFactory extends RobotFactory {
    installSpecialModule(robot) {
        robot.buildStage = 3;
        robot.type = 'REPAIR';
        robot.color = '#22c55e';
        robot.accentColor = '#86efac';
        robot.parts.weapon = 'WRENCH';
        robot.label = 'RepairBot';
    }
    getModuleName() { return 'Instalando Brazo Hidráulico y Soldador [REPARACIÓN]'; }
    getModuleColor() { return '#22c55e'; }
}

// ═══════════════════════════════════════════════════════════
// SUBCLASE C: ScoutBot  ← NUEVA
// Sobreescribe installSpecialModule() con módulo de escaneo
// ═══════════════════════════════════════════════════════════
class ScoutRobotFactory extends RobotFactory {
    installSpecialModule(robot) {
        robot.buildStage = 3;
        robot.type = 'SCOUT';
        robot.color = '#f59e0b';
        robot.accentColor = '#fde68a';
        robot.parts.weapon = 'RADAR';
        robot.label = 'ScoutBot';
    }
    getModuleName() { return 'Instalando Sistema de Radar y Sigilo [EXPLORACIÓN]'; }
    getModuleColor() { return '#f59e0b'; }
}
