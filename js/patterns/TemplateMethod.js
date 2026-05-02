/**
 * PATRÓN: TEMPLATE METHOD
 * Define el esqueleto de un algoritmo en una operación, delegando algunos pasos a las subclases.
 */

// Clase Abstracta (Template)
class RobotFactory {
    // El "Template Method" - Define la estructura fija
    async assembleRobot(canvas) {
        console.log("Iniciando secuencia de ensamblaje...");
        
        const robot = new Robot(canvas);
        
        // Pasos del algoritmo
        this.prepareChassis(robot);
        await this.delay(500);
        
        this.installCore(robot);
        await this.delay(500);
        
        // Paso variable (Hook/Abstract) que implementarán las subclases
        this.installSpecialModule(robot);
        await this.delay(500);
        
        this.finalize(robot);
        
        return robot;
    }

    // Paso común
    prepareChassis(robot) {
        robot.log("Preparando chasis reforzado...");
        robot.parts.body = true;
    }

    // Paso común
    installCore(robot) {
        robot.log("Instalando núcleo de energía central...");
        robot.parts.core = true;
    }

    // Paso abstracto (debe ser implementado por subclases)
    installSpecialModule(robot) {
        throw new Error("El método installSpecialModule debe ser implementado");
    }

    // Paso común
    finalize(robot) {
        robot.log("Secuencia de ensamblaje completada con éxito.");
        robot.isReady = true;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Subclase Concreta A
class CombatRobotFactory extends RobotFactory {
    installSpecialModule(robot) {
        robot.log("INSTALANDO: Cañón Láser de Pulso (Módulo de Combate)");
        robot.type = 'COMBAT';
        robot.color = '#ef4444';
        robot.parts.weapon = 'LASER';
    }
}

// Subclase Concreta B
class RepairRobotFactory extends RobotFactory {
    installSpecialModule(robot) {
        robot.log("INSTALANDO: Brazo Hidráulico y Soldador (Módulo de Reparación)");
        robot.type = 'REPAIR';
        robot.color = '#22c55e';
        robot.parts.weapon = 'WRENCH';
    }
}
