# Historial de Prompts — Patrones Strategy y Template Method
**Herramienta de IA:** Antigravity (Google DeepMind)  
**Repositorio:** https://github.com/yoesitooo/Diferencias_Template_Strategy

---

## Prompt 1 — Definición del Ejercicio y Propuesta de Idea
**Usuario:**
> necesito que me ayudes en algo tú, mira;
>
> Generado por IA implementar un ejemplo gráfico que demuestra las diferencias entre los patrones Strategy y Template Method, no se puede modificar directamente el código generado, todo debe ser generado usando promts en la herramienta de IA seleccionada.
>
> Se debe entregar en el repositorio: el codigo resultante (funcional) y el histórico de promts y respuestas de la herramienta de IA.
>
> esta es la ide aprincipal del ejercicio entonces necesito que pienses primero en que va a ser la implementación grafica para que el ejercicoo pueda verse directamente, pasame la idea y te confirmo, además ve llenando un archivo .MD o uno de texto que quieras con estos promts que te envío para poder cumplir con la actividad, comienza guardando este

**Respuesta (Antigravity):**
> Propuse el concepto **"Robot Design & Behavior Lab"**: una aplicación web interactiva que usa dos paneles para demostrar ambos patrones.
>
> **Template Method** controla la CONSTRUCCIÓN del robot:
> - Esqueleto fijo: Preparar Chasis → Instalar Núcleo → **Módulo Especial** → Finalizar
> - El Módulo Especial varía: CombatBot instala un cañón láser, RepairBot instala un brazo mecánico.
>
> **Strategy** controla el COMPORTAMIENTO de movimiento:
> - El mismo robot puede cambiar su algoritmo de movimiento en tiempo real (Patrulla, Seguir Cursor, Órbita).
> - Demuestra que Strategy usa composición (no herencia) y es intercambiable sin reconstruir el objeto.

---

## Prompt 2 — Confirmación e Instrucciones de Implementación
**Usuario:**
> me parece totalmente, no uses nuestros agentes aquí pues necesito que quede bien hecho, nada experimental po reso necesdito que lo hagas tú completamente, ahora crea diretamente la carpeta con subcarpetas y modulos necesarios para hacerlo, y otra cosa a pensar es solo usaras HTML/JS/CSS, porque tipo podrias pensar en python con alguna libreria util o incluso ampliar la idea a alguna api base que pueda ayudarnos

**Respuesta (Antigravity):**
> Generé la estructura de proyecto modular v1 completa en HTML/CSS/JS puro:
>
> ```
> robot-lab/
> ├── index.html                    (UI con paneles de control)
> ├── style.css                     (diseño premium con tema oscuro)
> └── js/
>     ├── patterns/
>     │   ├── TemplateMethod.js     (RobotFactory, CombatRobotFactory, RepairRobotFactory)
>     │   └── Strategy.js           (PatrolStrategy, FollowMouseStrategy, OrbitStrategy)
>     ├── components/
>     │   └── Robot.js              (clase Robot — contexto de Strategy + resultado de Template Method)
>     └── main.js                   (orquestador + bucle de animación Canvas)
> ```
>
> La demostración v1 muestra:
> 1. Log paso a paso del Template Method al construir cada tipo de robot.
> 2. Botones para intercambiar la estrategia de movimiento en tiempo real.

---

## Prompt 3 — Conexión a GitHub, Verificación y Mejoras
**Usuario:**
> 1. Este es el repositorio, conecta la carpeta de este ejercicio, crea el git add . para comenzar el versionamiento y haz los commits en español, donde expliques que hiciste y al final especifica que fuiste tú el que los hizo para que sea verificable que solo tú creaste el proceso.
> 2. Piensa si es verificable la diferencia, puedes darme una idea de por que cumple con el requerimiento principal, si es posible maneja mi pantalla y muestrame como se vé esta diferencia.
> 3. Piensa en que otras cosas podrias agregarle al desarrollo, me gusta pero ¿podemos hacelro menos sencillo?, la idea es usar más de dos promts para no ser mediocres.

**Respuesta (Antigravity):**

### Git — Historial de Commits (verificable en el repo)
```
commit ae8dbcf — "Inicio del proyecto: Laboratorio grafico de patrones Strategy y Template Method"
commit 2c9ba86 — "Mejora v2: Campo de batalla multi-robot, 5 estrategias y panel UML"
```
Todos los commits tienen la firma: *"Generado integramente por Antigravity (IA)."*

### ¿Por qué es verificable la diferencia?

| Característica | Template Method | Strategy |
|---|---|---|
| Momento de variación | **Diseño** (define subclases antes de ejecutar) | **Runtime** (cambia mientras corre) |
| Mecanismo | **Herencia** — subclase sobreescribe un método | **Composición** — objeto externo reemplaza el algoritmo |
| Qué varía | Un **paso** dentro de un flujo fijo | El **algoritmo completo** |
| Demo visual | El log muestra 4 pasos idénticos, solo el Paso 3 cambia por tipo | Los botones de estrategia cambian el movimiento **sin reconstruir** el robot |

**El "ajá" visual de la demo:** cuando construyes 3 robots distintos (CombatBot, RepairBot, ScoutBot) — todos pasan por los mismos 4 pasos del Template Method. Luego cambias la estrategia a "Órbita Circular" y los 3 robots cambian de comportamiento **instantáneamente** sin ser destruidos ni reconstruidos — eso es imposible con herencia pura.

### Mejoras implementadas en v2
1. **ScoutBot** — tercer tipo de robot vía Template Method (módulo Radar pulsante)
2. **5 Estrategias** — agregadas ChaosStrategy (movimiento impredecible) y FormationStrategy (vuelo en V coordinado)
3. **Campo de batalla multi-robot** — hasta 5 robots simultáneos, cada uno con estrategia independiente
4. **Sistema de partículas** — cada estrategia emite partículas de color distinto (trail visual)
5. **Panel lateral derecho** — tabla comparativa de patrones, visor de código activo y diagrama UML simplificado
6. **Construcción visual por etapas** — las partes del robot aparecen físicamente en el canvas al ritmo del Template Method
7. **Flash de cambio** — efecto de destello al cambiar de estrategia (demuestra el swap en tiempo real)
8. **Selector individual vs global** — checkbox para aplicar la estrategia a un robot o a todos

---

## Prompt 4 — Continuación y Verificación Final
**Usuario:**
> Continue (×3) — solicitando verificar visualmente la aplicación en el navegador.

**Respuesta (Antigravity):**
> Se detectaron problemas con el servidor de desarrollo del entorno (viewports en 0x0 que impedían la interacción del subagente de browser). El código generado fue validado directamente revisando los archivos fuente — no hay errores de sintaxis. El servidor http-server fue relanzado en múltiples puertos (8080, 8081, 8082) y el archivo se puede abrir directamente haciendo doble clic en `robot-lab/index.html`. El historial de prompts fue completado y pusheado al repositorio con todos los commits firmados por Antigravity.

---

*Todo el código fue generado integramente por Antigravity (IA) — Google DeepMind.*  
*Ninguna línea fue escrita manualmente por el usuario.*
