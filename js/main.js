/**
 * main.js — Orquestador de la aplicación Robot Design Lab
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const ctx    = canvas.getContext('2d');

    // ── Estado Global ─────────────────────────────────────────
    let robots   = []; // campo de batalla multi-robot
    let mousePos = { x: 0, y: 0 };
    let building = false;
    let selectedRobotIndex = -1;

    // Estrategia por defecto para nuevos robots
    let pendingStrategy = new PatrolStrategy();

    // ── Resize ────────────────────────────────────────────────
    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // ── Mouse tracking ────────────────────────────────────────
    canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mousePos.x = e.clientX - r.left;
        mousePos.y = e.clientY - r.top;
    });

    // Seleccionar robot al hacer click en el canvas
    canvas.addEventListener('click', e => {
        const r = canvas.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        const hit = robots.findIndex(rb => rb.isReady && Math.hypot(rb.x - mx, rb.y - my) < 40);
        if (hit !== -1) {
            selectedRobotIndex = hit;
            updateRobotInfo(robots[hit]);
            updateSelected();
        }
    });

    // ── Botones de construcción (Template Method) ──────────────
    const factories = {
        'btn-build-combat': CombatRobotFactory,
        'btn-build-repair': RepairRobotFactory,
        'btn-build-scout':  ScoutRobotFactory,
    };

    Object.entries(factories).forEach(([btnId, FactoryClass]) => {
        document.getElementById(btnId).addEventListener('click', () => {
            if (building) return;
            buildRobot(new FactoryClass());
        });
    });

    async function buildRobot(factory) {
        if (robots.length >= 5) {
            robots.shift(); // quitar el más viejo si hay demasiados
        }

        building = true;
        document.querySelectorAll('.btn-build').forEach(b => b.disabled = true);
        
        // Posición aleatoria en el canvas
        const spawnX = 100 + Math.random() * (canvas.width - 200);
        const spawnY = 100 + Math.random() * (canvas.height - 200);

        // Template Method — el proceso de construcción paso a paso
        const robot = await factory.assembleRobot(spawnX, spawnY, canvas, onBuildStep);
        robot.setMovementStrategy(strategyClone(pendingStrategy, robots.length));
        robots.push(robot);

        selectedRobotIndex = robots.length - 1;
        updateRobotInfo(robot);
        updateSelected();

        document.querySelectorAll('.btn-build').forEach(b => b.disabled = false);
        building = false;

        addLog(`${robot.label} desplegado [${robot.movementStrategy.getName()}]`, robot.color);
        updateRobotCount();
    }

    function onBuildStep(message, color, robot) {
        addLog(message, color);
        updateBuildProgress(robot.buildStage);
    }

    // ── Botones de estrategia (Strategy) ─────────────────────
    const strategyMap = {
        'btn-strat-patrol': PatrolStrategy,
        'btn-strat-follow': FollowMouseStrategy,
        'btn-strat-orbit':  OrbitStrategy,
        'btn-strat-chaos':  ChaosStrategy,
        'btn-strat-formation': FormationStrategy,
    };

    Object.entries(strategyMap).forEach(([btnId, StratClass]) => {
        document.getElementById(btnId).addEventListener('click', () => {
            const strat = new StratClass();
            pendingStrategy = strat;

            // Resaltar botón activo
            document.querySelectorAll('.btn-strategy').forEach(b => b.classList.remove('active'));
            document.getElementById(btnId).classList.add('active');

            // Modo: aplicar a TODOS o solo al seleccionado
            const applyAll = document.getElementById('chk-apply-all').checked;
            if (applyAll) {
                robots.forEach((rb, i) => {
                    if (rb.isReady) rb.setMovementStrategy(strategyClone(strat, i));
                });
                addLog(`Estrategia '${strat.getName()}' → Todos los robots`, strat.getColor());
            } else if (selectedRobotIndex >= 0 && robots[selectedRobotIndex]?.isReady) {
                robots[selectedRobotIndex].setMovementStrategy(strat);
                addLog(`Estrategia '${strat.getName()}' → ${robots[selectedRobotIndex].label}`, strat.getColor());
            }

            updateCodePanel(btnId);
        });
    });

    // Botón limpiar campo
    document.getElementById('btn-clear').addEventListener('click', () => {
        robots = [];
        selectedRobotIndex = -1;
        addLog('Campo de batalla limpiado', '#94a3b8');
        updateRobotCount();
        document.getElementById('info-name').textContent = 'Sin robot seleccionado';
        document.getElementById('info-type').textContent = '';
        document.getElementById('info-strategy').textContent = '';
    });

    // ── Helpers ───────────────────────────────────────────────

    // Crea instancia fresca de una estrategia (para Formation, que necesita índice)
    function strategyClone(original, index) {
        if (original instanceof FormationStrategy) {
            return new FormationStrategy(index, Math.max(1, robots.length + 1));
        }
        return new original.constructor();
    }

    function updateRobotInfo(robot) {
        document.getElementById('info-name').textContent = robot.label;
        document.getElementById('info-type').textContent = `Tipo: ${robot.type}`;
        document.getElementById('info-strategy').textContent = robot.movementStrategy
            ? `Estrategia: ${robot.movementStrategy.getName()}`
            : 'Sin estrategia';
    }

    function updateSelected() {
        document.querySelectorAll('.robot-chip').forEach((c, i) => {
            c.classList.toggle('active', i === selectedRobotIndex);
        });
    }

    function updateRobotCount() {
        document.getElementById('robot-count').textContent = `${robots.length}/5`;
    }

    function updateBuildProgress(stage) {
        document.querySelectorAll('.progress-step').forEach((el, i) => {
            el.classList.toggle('done', i < stage);
            el.classList.toggle('current', i === stage - 1);
        });
    }

    function addLog(message, color = '#94a3b8') {
        const log = document.getElementById('event-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.style.color = color;
        const time = new Date().toLocaleTimeString('es', { hour12: false });
        entry.innerHTML = `<span class="log-time">${time}</span> ${message}`;
        log.prepend(entry);
        // Máximo 20 entradas
        while (log.children.length > 20) log.removeChild(log.lastChild);
    }

    function updateCodePanel(btnId) {
        const snippets = {
            'btn-strat-patrol':   `// Strategy: PatrolStrategy\nupdate(robot, canvas) {\n  robot.x += this.speed * this.direction;\n  if (robot.x > canvas.width - 60)\n    this.direction = -1;\n  if (robot.x < 60)\n    this.direction = 1;\n}`,
            'btn-strat-follow':   `// Strategy: FollowMouseStrategy\nupdate(robot, canvas, mousePos) {\n  const dx = mousePos.x - robot.x;\n  const dy = mousePos.y - robot.y;\n  const speed = Math.min(4, Math.hypot(dx,dy) * 0.08);\n  robot.x += (dx / dist) * speed;\n  robot.y += (dy / dist) * speed;\n}`,
            'btn-strat-orbit':    `// Strategy: OrbitStrategy\nupdate(robot, canvas) {\n  this.angle += this.speed;\n  robot.x = cx + Math.cos(this.angle) * this.radius;\n  robot.y = cy + Math.sin(this.angle) * this.radius;\n}`,
            'btn-strat-chaos':    `// Strategy: ChaosStrategy\nupdate(robot, canvas) {\n  if (++this.changeTimer > 80)\n    this.vx = (Math.random()-0.5)*6;\n    this.vy = (Math.random()-0.5)*6;\n  robot.x += this.vx;\n  robot.y += this.vy;\n}`,
            'btn-strat-formation':`// Strategy: FormationStrategy\nupdate(robot, canvas) {\n  this.angle += 0.012;\n  const vIndex = this.index - floor(total/2);\n  const tx = cx + cos(angle)*120 + vIndex*spread;\n  robot.x += (tx - robot.x) * 0.08;\n}`,
        };
        const panel = document.getElementById('code-snippet');
        if (snippets[btnId]) panel.textContent = snippets[btnId];
    }

    // ── Bucle de Animación ────────────────────────────────────
    function drawGrid(ctx, w, h) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        const spacing = 50;
        ctx.beginPath();
        for (let x = 0; x < w; x += spacing) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = 0; y < h; y += spacing) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
    }

    function animate() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);

        // Dibujar líneas de "formación" si hay múltiples robots en órbita
        if (robots.length > 1 && robots.every(r => r.movementStrategy instanceof FormationStrategy)) {
            ctx.strokeStyle = 'rgba(52,211,153,0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            const ready = robots.filter(r => r.isReady);
            ready.forEach((r, i) => {
                if (i === 0) ctx.moveTo(r.x, r.y); else ctx.lineTo(r.x, r.y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
        }

        robots.forEach(r => {
            r.update(mousePos);
            r.draw(ctx);
        });

        // Indicador de robot seleccionado
        if (selectedRobotIndex >= 0 && robots[selectedRobotIndex]?.isReady) {
            const r = robots[selectedRobotIndex];
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(r.x, r.y, 48, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Actualizar info del robot seleccionado en tiempo real
        if (selectedRobotIndex >= 0 && robots[selectedRobotIndex]?.isReady) {
            const r = robots[selectedRobotIndex];
            if (r.movementStrategy) {
                document.getElementById('info-strategy').textContent = `Estrategia: ${r.movementStrategy.getName()}`;
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
    addLog('Sistema iniciado. Selecciona un tipo de robot para comenzar.', '#38bdf8');
});
