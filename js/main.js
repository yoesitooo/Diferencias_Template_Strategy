/**
 * Orquestador principal de la aplicación.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const ctx = canvas.getContext('2d');
    const logContainer = document.getElementById('event-log');
    
    // UI Elements
    const btnBuildCombat = document.getElementById('btn-build-combat');
    const btnBuildRepair = document.getElementById('btn-build-repair');
    const btnStratPatrol = document.getElementById('btn-strat-patrol');
    const btnStratFollow = document.getElementById('btn-strat-follow');
    const btnStratOrbit = document.getElementById('btn-strat-orbit');
    
    const robotNameDisplay = document.getElementById('robot-name');
    const robotDescDisplay = document.getElementById('robot-desc');

    let currentRobot = null;
    let mousePos = { x: 0, y: 0 };
    let currentStrategy = new PatrolStrategy();

    // Redimensionar canvas
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Seguimiento de mouse
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;
    });

    // --- ACCIONES TEMPLATE METHOD ---
    
    async function buildRobot(factoryType) {
        // Deshabilitar botones durante construcción
        btnBuildCombat.disabled = true;
        btnBuildRepair.disabled = true;
        
        let factory;
        if (factoryType === 'COMBAT') {
            factory = new CombatRobotFactory();
            robotNameDisplay.textContent = "Construyendo CombatBot...";
        } else {
            factory = new RepairRobotFactory();
            robotNameDisplay.textContent = "Construyendo RepairBot...";
        }

        // Ejecutar el Template Method
        currentRobot = await factory.assembleRobot(canvas);
        
        // Aplicar la estrategia actual al nuevo robot
        currentRobot.setMovementStrategy(currentStrategy);
        
        // Actualizar UI
        robotNameDisplay.textContent = currentRobot.type + " Activo";
        robotDescDisplay.textContent = currentRobot.type === 'COMBAT' 
            ? "Especializado en defensa de perímetros. Equipado con láser de alta potencia."
            : "Especializado en mantenimiento técnico. Equipado con herramientas de precisión.";
        
        btnBuildCombat.disabled = false;
        btnBuildRepair.disabled = false;
    }

    btnBuildCombat.addEventListener('click', () => {
        btnBuildCombat.classList.add('active');
        btnBuildRepair.classList.remove('active');
        buildRobot('COMBAT');
    });

    btnBuildRepair.addEventListener('click', () => {
        btnBuildRepair.classList.add('active');
        btnBuildCombat.classList.remove('active');
        buildRobot('REPAIR');
    });

    // --- ACCIONES STRATEGY ---

    function updateStrategy(strategy, btn) {
        currentStrategy = strategy;
        
        // Limpiar clases activas
        [btnStratPatrol, btnStratFollow, btnStratOrbit].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (currentRobot) {
            currentRobot.setMovementStrategy(strategy);
        }
    }

    btnStratPatrol.addEventListener('click', () => updateStrategy(new PatrolStrategy(), btnStratPatrol));
    btnStratFollow.addEventListener('click', () => updateStrategy(new FollowMouseStrategy(), btnStratFollow));
    btnStratOrbit.addEventListener('click', () => updateStrategy(new OrbitStrategy(), btnStratOrbit));

    // --- BUCLE DE ANIMACIÓN ---

    function animate() {
        // Limpiar fondo con un rastro suave (trail effect)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar rejilla de fondo decorativa
        drawGrid();

        if (currentRobot) {
            currentRobot.update(mousePos);
            currentRobot.draw(ctx);
        }

        requestAnimationFrame(animate);
    }

    function drawGrid() {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        const spacing = 50;
        
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += spacing) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y < canvas.height; y += spacing) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
    }

    animate();
});
