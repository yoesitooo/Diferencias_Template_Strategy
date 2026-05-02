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
