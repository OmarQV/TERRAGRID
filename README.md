# TERRAGRID — Landing Page

Sitio oficial del nuevo rumbo de **TERRAGRID**, una startup AgroTech boliviana que desarrolla incubación agrícola inteligente para obtener plantines uniformes, medibles y trazables.

La narrativa sigue el roadmap real del proyecto:

1. **TERRAGRID SEED — MVP actual:** germinación y producción inicial de plantines. El piloto prioriza perejil; lechuga sirve como referencia técnica y tomate se trabaja hasta plantín para trasplante.
2. **TERRAGRID GROW — siguiente etapa:** crecimiento y producción hidropónica compacta, inicialmente para lechuga, perejil y otros cultivos de hoja.
3. **TERRAGRID SEED BANK — visión futura:** conservación distribuida de semillas, pruebas periódicas de viabilidad y apoyo a su regeneración.

La página distingue lo que pertenece al MVP, al roadmap y a la visión futura. No presenta resultados agronómicos aún no obtenidos ni describe la trazabilidad digital como una certificación oficial.

## Experiencia

Hero de una sola pantalla (≈100vh) con estética AgTech clara y premium:

- Navbar flotante, badge «Preincubación · La Paz, Bolivia», titular «Agricultura inteligente para un futuro real.» y llamados a la acción.
- Fotografía del altiplano como fondo, con un velo blanco suave a la izquierda para garantizar la legibilidad.
- Cámara TERRAGRID SEED (imagen con fondo transparente) como protagonista, con tres tarjetas IoT flotantes (temperatura, humedad, riego) unidas a la máquina por líneas finas.
- Panel de métricas del piloto (cultivos, sistema, seguimiento a 7–14–30 días, evidencia).
- Animaciones de entrada y vaivén muy sutiles; se desactivan con `prefers-reduced-motion`.
- Responsive: escritorio, tablet (dos columnas) y móvil (una columna, métricas en 2×2).

Las secciones siguientes (Tecnología, Beneficios, Cómo funciona, Equipo) aún no existen: los enlaces del navbar apuntan a anclas futuras.

## Tecnología

- React 19 + TypeScript
- Vite
- Tailwind CSS 4 (`@tailwindcss/vite`), tokens de color y animaciones en `src/index.css`
- Lucide React para iconografía
- Inter Variable autoalojada con `@fontsource-variable/inter`
- Oxlint

## Activos 3D

> La landing actual no carga estos modelos; se conservan del sitio anterior.

Los modelos entregados se optimizaron para web con compresión Draco y simplificación geométrica. Las versiones originales permanecen fuera del proyecto de producción; la aplicación utiliza:

| Línea | Ruta web | Tamaño aproximado |
| --- | --- | ---: |
| SEED | `public/models/terragrid-seed.glb` | 16,6 MB |
| GROW | `public/models/terragrid-grow.glb` | 11,7 MB |
| SEED BANK | `public/models/terragrid-seed-bank.glb` | 21,3 MB |

Los decodificadores Draco se sirven localmente desde `public/draco/`. Las imágenes conceptuales se encuentran en `public/products/` y funcionan como póster y alternativa visual.

## Identidad visual

- `public/brand/terragrid-mark.svg`: símbolo independiente.
- `public/brand/terragrid-logo.svg`: versión horizontal para fondos oscuros.
- `public/brand/terragrid-logo-light.svg`: versión horizontal para fondos claros.
- `public/favicon.svg`: favicon propio derivado del símbolo TERRAGRID.

## Desarrollo

Requiere Node.js moderno y pnpm.

```bash
pnpm install
pnpm dev
```

La aplicación estará disponible normalmente en `http://localhost:5173`.

## Verificación

```bash
pnpm lint
pnpm build
```

## Estructura principal

```text
Terra-Grid/
├── public/            # Marca, equipo, modelos 3D y renders de producto
├── src/
│   ├── assets/
│   │   ├── hero-andes.webp          # Paisaje del hero (fotografía)
│   │   └── terragrid-machine.webp   # Cámara TERRAGRID con fondo transparente
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── SensorCard.tsx
│   │   ├── StatsPanel.tsx
│   │   └── Logo.tsx
│   ├── App.tsx
│   ├── index.css      # Tailwind, tokens y estilos específicos del hero
│   └── main.tsx
├── index.html
└── package.json
```

## Créditos de imágenes

- `hero-andes.webp`: fotografía del Illimani desde La Paz por [Azzedine Rouichi](https://unsplash.com/photos/No6mIqzvq5o) en Unsplash (Licencia Unsplash), redimensionada y con un leve ajuste de color.
- `terragrid-machine.webp`: recorte con fondo transparente de `public/products/terragrid-seed.png`.

## Alcance actual

TERRAGRID se encuentra en preincubación y diseño/validación del MVP. La primera evidencia debe obtenerse comparando el sistema con un método de referencia y midiendo germinación, velocidad de emergencia, uniformidad, descarte, consumo de recursos, costo por plantín aceptado y supervivencia posterior al trasplante.

Universidad Mayor de San Andrés · La Paz, Bolivia · 2026.
