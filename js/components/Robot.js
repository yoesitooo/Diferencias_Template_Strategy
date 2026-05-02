class Robot {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 60;
        this.type = 'NONE';
        this.color = '#94a3b8';
        this.isReady = false;
        
        // El "Contexto" del patrón Strategy
        this.movementStrategy = null;
        
        this.parts = {
            body: false,
            core: false,
            weapon: null
        };

        this.logContainer = document.getElementById('event-log');
    }

    // Método para cambiar de estrategia (Setter de composición)
    setMovementStrategy(strategy) {
        this.movementStrategy = strategy;
        this.log(`Cambio de estrategia: ${strategy.constructor.name}`);
    }

    update(mousePos) {
        if (!this.isReady || !this.movementStrategy) return;
        
        // Delega la ejecución a la estrategia actual
        this.movementStrategy.update(this, this.canvas, mousePos);
    }

    draw(ctx) {
        if (!this.parts.body) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Sombrilla / Brillo
        const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Cuerpo (Dibujado si el Template Method lo activó)
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-20, -20, 40, 40);
        ctx.fillRect(-20, -20, 40, 40);

        // Núcleo (Dibujado si el Template Method lo activó)
        if (this.parts.core) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Animación de pulso
            const pulse = Math.sin(Date.now() / 200) * 2;
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.arc(0, 0, 10 + pulse, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Arma Especial (Instalada por la subclase en Template Method)
        if (this.parts.weapon === 'LASER') {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(15, -5, 20, 10);
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ef4444';
        } else if (this.parts.weapon === 'WRENCH') {
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(20, 0, 10, 0.5, Math.PI * 1.5);
            ctx.stroke();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#22c55e';
        }

        ctx.restore();
    }

    log(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = message;
        this.logContainer.prepend(entry);
        console.log(`[Robot]: ${message}`);
    }
}
