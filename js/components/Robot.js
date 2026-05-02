/**
 * Clase Robot — Contexto del patrón Strategy + Objeto construido por Template Method
 * Mantiene referencia a UNA estrategia de movimiento y la puede cambiar en runtime.
 */
class Robot {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.size = 28;
        this.type = 'NONE';
        this.label = '???';
        this.color = '#94a3b8';
        this.accentColor = '#cbd5e1';
        this.isReady = false;
        this.buildStage = 0;

        // ★ COMPOSICIÓN — referencia a la estrategia intercambiable
        this.movementStrategy = null;

        this.parts = { body: false, core: false, weapon: null };

        // Partículas propias del robot
        this.particles = [];

        // Trail (rastro de posiciones)
        this.trail = [];
        this.maxTrail = 30;

        // Animaciones
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.builtTime = 0;
        this.switchFlash = 0; // destello al cambiar estrategia
    }

    // ★ Setter del patrón Strategy — puede llamarse en cualquier momento
    setMovementStrategy(strategy) {
        this.movementStrategy = strategy;
        this.switchFlash = 1.0;
        this.particles = []; // limpiar rastro al cambiar
    }

    update(mousePos, dt = 1) {
        if (!this.isReady || !this.movementStrategy) return;

        // Guardar trail
        this.trail.push({ x: this.x, y: this.y, life: 1 });
        if (this.trail.length > this.maxTrail) this.trail.shift();
        this.trail.forEach(t => t.life -= 0.03);

        // Delegar a la estrategia actual
        this.movementStrategy.update(this, this.canvas, mousePos, dt);

        // Emitir partículas de la estrategia
        if (Math.random() < 0.4) {
            const newP = this.movementStrategy.emitParticles(this);
            this.particles.push(...newP);
        }

        // Actualizar partículas
        this.particles = this.particles.filter(p => {
            p.life -= p.decay;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravedad suave
            return p.life > 0;
        });

        this.builtTime += 0.04;
        if (this.switchFlash > 0) this.switchFlash -= 0.05;
    }

    draw(ctx) {
        if (this.buildStage === 0) return;

        const s = this.movementStrategy;
        const trailColor = s ? s.getTrailColor() : 'rgba(148,163,184,0.1)';

        // ── Trail ──
        ctx.save();
        this.trail.forEach((t, i) => {
            const alpha = (t.life * (i / this.trail.length)) * 0.5;
            ctx.fillStyle = trailColor.replace('0.25', alpha.toFixed(2));
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.size * 0.3 * t.life, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        // ── Partículas ──
        ctx.save();
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.restore();

        ctx.save();
        ctx.translate(this.x, this.y);

        const pulse = Math.sin(this.builtTime + this.pulsePhase);

        // ── Flash al cambiar de estrategia ──
        if (this.switchFlash > 0) {
            ctx.globalAlpha = this.switchFlash * 0.5;
            ctx.fillStyle = s ? s.getColor() : 'white';
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // ── Aura exterior ──
        const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2.2);
        aura.addColorStop(0, this.color + '44');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // ── CUERPO (Paso 1 del Template Method) ──
        if (this.buildStage >= 1) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.fillStyle = '#0f172a';
            const s2 = this.size;
            this._roundedRect(ctx, -s2, -s2, s2 * 2, s2 * 2, 6);
            ctx.fill();
            ctx.stroke();

            // Esquinas decorativas
            const c = this.accentColor;
            ctx.fillStyle = c;
            [[-s2,-s2],[s2-4,-s2],[-s2,s2-4],[s2-4,s2-4]].forEach(([cx, cy]) => {
                ctx.fillRect(cx, cy, 4, 4);
            });
        }

        // ── NÚCLEO (Paso 2 del Template Method) ──
        if (this.buildStage >= 2) {
            const pulseFactor = 1 + pulse * 0.15;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, 6 * pulseFactor, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = this.accentColor + '88';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, 11 * pulseFactor, 0, Math.PI * 2);
            ctx.stroke();
        }

        // ── MÓDULO ESPECIAL (Paso 3 — varía por subclase Template Method) ──
        if (this.buildStage >= 3) {
            if (this.parts.weapon === 'LASER') {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fillRect(this.size, -4, 18, 8);
                // boca del cañón
                ctx.beginPath();
                ctx.arc(this.size + 18, 0, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (this.parts.weapon === 'WRENCH') {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                // brazo mecánico
                ctx.beginPath();
                ctx.moveTo(this.size, 0);
                ctx.lineTo(this.size + 12, -10);
                ctx.lineTo(this.size + 20, 0);
                ctx.lineTo(this.size + 12, 10);
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else if (this.parts.weapon === 'RADAR') {
                // antena + círculo de radar pulsante
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(0, -this.size - 12);
                ctx.stroke();
                const radarR = (12 + pulse * 6) ;
                ctx.globalAlpha = 0.4 + pulse * 0.3;
                ctx.beginPath();
                ctx.arc(0, -this.size - 12, radarR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        // ── LABEL ──
        if (this.buildStage >= 4) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.label, 0, this.size + 16);

            // Estrategia activa bajo el label
            if (this.movementStrategy) {
                ctx.fillStyle = this.movementStrategy.getColor();
                ctx.font = '8px Inter, sans-serif';
                ctx.fillText(`[${this.movementStrategy.getName()}]`, 0, this.size + 27);
            }
        }

        ctx.restore();
    }

    _roundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}
