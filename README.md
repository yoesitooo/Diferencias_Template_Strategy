# Robot Design Lab: Strategy vs Template Method

## Integrantes
 - Sebastian Jaramillo Hernandes - 20241020002
 - Jhoe Luis Jeanpaul Miranda Alvarez - 20241020022

Este proyecto es una demostración gráfica e interactiva de las diferencias fundamentales entre los patrones de diseño **Strategy** y **Template Method**, implementada íntegramente mediante Inteligencia Artificial (Antigravity).


## 🚀 Cómo empezar
Simplemente abre el archivo `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge). No requiere dependencias externas ni servidores complejos.

## 🛠️ Los Patrones en Acción

### 1. Template Method (Herencia / Estructura Fija)
Se utiliza para el proceso de **Ensamblaje del Robot**.
- **Esqueleto del Algoritmo:** Ubicado en `js/patterns/TemplateMethod.js`. Define una secuencia fija de 4 pasos:
    1. Preparar Chasis (Fijo)
    2. Instalar Núcleo (Fijo)
    3. **Instalar Módulo Especial (Variable - Hook)**
    4. Finalizar (Fijo)
- **Variación:** Las subclases (`CombatBot`, `RepairBot`, `ScoutBot`) implementan únicamente el paso 3. El "Template Method" asegura que el proceso de construcción sea consistente para todos los robots, permitiendo que cada tipo aporte su parte específica.

### 2. Strategy (Composición / Comportamiento Intercambiable)
Se utiliza para el **Sistema de Navegación**.
- **Mecanismo:** Ubicado en `js/patterns/Strategy.js`. En lugar de usar herencia, el robot contiene una referencia a una "Estrategia de Movimiento".
- **Flexibilidad:** Puedes cambiar la estrategia (Patrulla, Órbita, Seguimiento, etc.) en tiempo de ejecución sin reconstruir el robot. Esto demuestra cómo la composición permite cambiar comportamientos de forma dinámica y desacoplada.

## 📊 Tabla Comparativa

| Característica | Template Method | Strategy |
|---|---|---|
| **Mecanismo** | Herencia (Clase Base) | Composición (Objetos) |
| **Cambio en Runtime** | No (Fijo al crear el objeto) | Sí (Intercambiable en vivo) |
| **Nivel de Variación** | Pasos específicos de un algoritmo | Algoritmo completo |
| **Acoplamiento** | Alto (Depende de la clase base) | Bajo (Desacoplado vía interfaz) |

## 📁 Estructura del Proyecto
- `js/patterns/`: Lógica pura de los patrones de diseño.
- `js/components/`: Representación visual del Robot.
- `js/main.js`: Orquestador de la simulación y la UI.
- `style.css`: Estilos visuales premium y layout de 3 columnas.

---
*Generado por Antigravity (IA) para propósitos educativos.*

### Algunas fotos visaules de la pantalla con los promts 
1.
<img width="1370" height="800" alt="Captura de pantalla 2026-05-02 113927" src="https://github.com/user-attachments/assets/3857316b-9096-46ab-8980-ef1c8887dbc8" />
2.
<img width="1550" height="811" alt="Captura de pantalla 2026-05-02 114441" src="https://github.com/user-attachments/assets/5cb6e81c-5610-4ed0-bf92-907986012ad0" />
3. (procesos pre respuesta, se previsualiza literalmente lo que hace el agente de IA)
<img width="1628" height="700" alt="Captura de pantalla 2026-05-02 123647" src="https://github.com/user-attachments/assets/2ee492b3-e2d2-4e7b-8889-c6f22c645d48" />
<img width="481" height="899" alt="Captura de pantalla 2026-05-02 121630" src="https://github.com/user-attachments/assets/543ee7d3-83aa-407d-8b2e-8be341b07889" />
<img width="376" height="592" alt="Captura de pantalla 2026-05-02 115207" src="https://github.com/user-attachments/assets/88659353-67c7-4dd3-ae07-591bc7587c4f" />
<img width="1421" height="475" alt="Captura de pantalla 2026-05-02 123951" src="https://github.com/user-attachments/assets/645a0fb0-8bd3-44d9-ba67-8f3ea2183ae4" />


