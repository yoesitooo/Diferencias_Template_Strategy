/**
 * ============================================================
 * PATRÓN: STRATEGY
 * ============================================================
 * Define una FAMILIA de algoritmos, los encapsula y los hace
 * INTERCAMBIABLES en tiempo de ejecución mediante composición.
 *
 * Diferencia clave vs Template Method:
 * - Template Method usa HERENCIA → la variación está en las subclases
 * - Strategy usa COMPOSICIÓN  → la variación está en objetos externos
 *   que se asignan dinámicamente al contexto (robot)
 *
 * Cada Strategy puede aplicarse a CUALQUIER robot sin distinción
 * de tipo. Eso es imposible con herencia pura.
 * ============================================================
 */

// ─── Clase Base (Interfaz de la Estrategia) ─────────────────
class MovementStrategy {
    getName()  { return 'Estrategia Base'; }
    getColor() { return '#94a3b8'; }
    getTrailColor() { return 'rgba(148,163,184,0.3)'; }
    update(robot, canvas, mousePos, dt) { /* abstracto */ }
    // Cada estrategia puede emitir partículas propias
    emitParticles(robot) { return []; }
}

// ═══════════════════════════════════════════════════════════
// ESTRATEGIA A: Patrulla (ida y vuelta horizontal)
// ═══════════════════════════════════════════════════════════
class PatrolStrategy extends MovementStrategy {
    constructor() {
        super();
        this.direction = 1;
        this.speed = 2.5;
    }
    getName()  { return 'Patrulla'; }
    getColor() { return '#38bdf8'; }
    getTrailColor() { return 'rgba(56,189,248,0.25)'; }

    update(robot, canvas) {
        robot.x += this.speed * this.direction;
        if (robot.x > canvas.width - 60)  { this.direction = -1; robot.flipEmit = true; }
        if (robot.x < 60)                  { this.direction =  1; robot.flipEmit = true; }
    }

    emitParticles(robot) {
        return [{
            x: robot.x - (this.direction * 20),
            y: robot.y,
            vx: -this.direction * (1 + Math.random()),
            vy: (Math.random() - 0.5) * 1.5,
            life: 1,
            decay: 0.04,
            color: this.getColor(),
            radius: 3
        }];
    }
}

// ═══════════════════════════════════════════════════════════
// ESTRATEGIA B: Seguir Cursor
// ═══════════════════════════════════════════════════════════
class FollowMouseStrategy extends MovementStrategy {
    getName()  { return 'Seguir Cursor'; }
    getColor() { return '#f472b6'; }
    getTrailColor() { return 'rgba(244,114,182,0.25)'; }

    update(robot, canvas, mousePos) {
        if (!mousePos) return;
        const dx = mousePos.x - robot.x;
        const dy = mousePos.y - robot.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 8) {
            const speed = Math.min(4, dist * 0.08);
            robot.x += (dx / dist) * speed;
            robot.y += (dy / dist) * speed;
        }
    }

    emitParticles(robot) {
        return [{
            x: robot.x + (Math.random() - 0.5) * 20,
            y: robot.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2,
            life: 1,
            decay: 0.05,
            color: this.getColor(),
            radius: 2.5
        }];
    }
}

// ═══════════════════════════════════════════════════════════
// ESTRATEGIA C: Órbita Circular
// ═══════════════════════════════════════════════════════════
class OrbitStrategy extends MovementStrategy {
    constructor() {
        super();
        this.angle = 0;
        this.radius = 160;
        this.speed = 0.018;
    }
    getName()  { return 'Órbita'; }
    getColor() { return '#a78bfa'; }
    getTrailColor() { return 'rgba(167,139,250,0.25)'; }

    update(robot, canvas) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        this.angle += this.speed;
        robot.x = cx + Math.cos(this.angle) * this.radius;
        robot.y = cy + Math.sin(this.angle) * this.radius;
    }

    emitParticles(robot) {
        const angle = Math.random() * Math.PI * 2;
        return [{
            x: robot.x + Math.cos(angle) * 8,
            y: robot.y + Math.sin(angle) * 8,
            vx: Math.cos(angle) * 1.5,
            vy: Math.sin(angle) * 1.5,
            life: 1,
            decay: 0.035,
            color: this.getColor(),
            radius: 2
        }];
    }
}

// ═══════════════════════════════════════════════════════════
// ESTRATEGIA D: Movimiento Caótico (NUEVA)
// ═══════════════════════════════════════════════════════════
class ChaosStrategy extends MovementStrategy {
    constructor() {
        super();
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.changeTimer = 0;
    }
    getName()  { return 'Movimiento Caótico'; }
    getColor() { return '#fb923c'; }
    getTrailColor() { return 'rgba(251,146,60,0.25)'; }

    update(robot, canvas) {
        this.changeTimer++;
        if (this.changeTimer > 60 + Math.random() * 80) {
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 0.5) * 6;
            this.changeTimer = 0;
        }
        robot.x = Math.max(50, Math.min(canvas.width - 50, robot.x + this.vx));
        robot.y = Math.max(50, Math.min(canvas.height - 50, robot.y + this.vy));

        if (robot.x <= 50 || robot.x >= canvas.width - 50)  this.vx *= -1;
        if (robot.y <= 50 || robot.y >= canvas.height - 50) this.vy *= -1;
    }

    emitParticles(robot) {
        return Array.from({ length: 2 }, () => ({
            x: robot.x + (Math.random() - 0.5) * 30,
            y: robot.y + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 1,
            decay: 0.06,
            color: this.getColor(),
            radius: 2
        }));
    }
}

// ═══════════════════════════════════════════════════════════
// ESTRATEGIA E: Formación (NUEVA) — robots se alinean en V
// ═══════════════════════════════════════════════════════════
class FormationStrategy extends MovementStrategy {
    constructor(index = 0, total = 1) {
        super();
        this.index = index;
        this.total = total;
        this.angle = 0;
    }
    getName()  { return 'Formación V'; }
    getColor() { return '#34d399'; }
    getTrailColor() { return 'rgba(52,211,153,0.25)'; }

    update(robot, canvas) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        this.angle += 0.012;

        const spread = 70;
        const vIndex = this.index - Math.floor(this.total / 2);
        const targetX = cx + Math.cos(this.angle) * 120 + vIndex * spread * Math.cos(this.angle + Math.PI / 2);
        const targetY = cy + Math.sin(this.angle) * 120 + vIndex * spread * Math.sin(this.angle + Math.PI / 2);

        robot.x += (targetX - robot.x) * 0.08;
        robot.y += (targetY - robot.y) * 0.08;
    }

    emitParticles(robot) {
        return [{
            x: robot.x,
            y: robot.y,
            vx: (Math.random() - 0.5),
            vy: 0.5 + Math.random(),
            life: 0.8,
            decay: 0.03,
            color: this.getColor(),
            radius: 1.5
        }];
    }
}
