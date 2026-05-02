/**
 * PATRÓN: STRATEGY
 * Define una familia de algoritmos, los encapsula y los hace intercambiables.
 */

// Interfaz de Estrategia (Base)
class MovementStrategy {
    update(robot, canvas) {
        // Método que cada estrategia implementará
    }
}

// Estrategia Concreta: Patrulla (Ida y vuelta)
class PatrolStrategy extends MovementStrategy {
    constructor() {
        super();
        this.direction = 1;
    }

    update(robot, canvas) {
        robot.x += 2 * this.direction;
        
        if (robot.x > canvas.width - 50 || robot.x < 50) {
            this.direction *= -1;
            robot.log("Patrulla: Cambio de dirección");
        }
    }
}

// Estrategia Concreta: Seguir al Mouse
class FollowMouseStrategy extends MovementStrategy {
    update(robot, canvas, mousePos) {
        if (!mousePos) return;

        const dx = mousePos.x - robot.x;
        const dy = mousePos.y - robot.y;
        const angle = Math.atan2(dy, dx);
        
        const speed = 3;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance > 5) {
            robot.x += Math.cos(angle) * speed;
            robot.y += Math.sin(angle) * speed;
        }
    }
}

// Estrategia Concreta: Órbita circular
class OrbitStrategy extends MovementStrategy {
    constructor() {
        super();
        this.angle = 0;
        this.radius = 150;
    }

    update(robot, canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        this.angle += 0.02;
        robot.x = centerX + Math.cos(this.angle) * this.radius;
        robot.y = centerY + Math.sin(this.angle) * this.radius;
    }
}
