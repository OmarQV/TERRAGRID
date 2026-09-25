# TERRAGRID — Landing Page

Sitio oficial del nuevo rumbo de **TERRAGRID**, una startup AgroTech boliviana que desarrolla incubación agrícola inteligente para obtener plantines uniformes, medibles y trazables.

La narrativa sigue el roadmap real del proyecto:

1. **TERRAGRID SEED — MVP actual:** germinación y producción inicial de plantines. El piloto prioriza perejil; lechuga sirve como referencia técnica y tomate se trabaja hasta plantín para trasplante.
2. **TERRAGRID GROW — siguiente etapa:** crecimiento y producción hidropónica compacta, inicialmente para lechuga, perejil y otros cultivos de hoja.
3. **TERRAGRID SEED BANK — visión futura:** conservación distribuida de semillas, pruebas periódicas de viabilidad y apoyo a su regeneración.

La página distingue lo que pertenece al MVP, al roadmap y a la visión futura. No presenta resultados agronómicos aún no obtenidos ni describe la trazabilidad digital como una certificación oficial.

## Experiencia

**Hero (≈100vh)** con estética AgTech clara y premium:

- Logotipo TERRAGRID grande sobre el titular «Agricultura inteligente para un futuro real.», descripción y llamados a la acción. El navbar es transparente y muestra el logotipo solo al hacer scroll, cuando pasa a una barra oscura translúcida.
- Fotografía del altiplano a pantalla completa como fondo, desenfocada de forma progresiva detrás del texto (izquierda en tablet/desktop, arriba en móvil) para que las letras claras se lean bien.
- Cámara TERRAGRID SEED (imagen con fondo transparente) como protagonista, con tres tarjetas IoT flotantes (temperatura, humedad, riego) unidas a la máquina por líneas finas.
- Panel de métricas del piloto y animaciones de entrada muy sutiles (se desactivan con `prefers-reduced-motion`).

**Secciones siguientes** (estilo oscuro, sin cambios de contenido):

- Problema, hipótesis y relato de las tres líneas (SEED, GROW, SEED BANK) con escenario 3D persistente y modelos interactivos.
- Capa inteligente, plan de validación, mercado inicial, modelo de negocio por etapas, equipo y llamado a colaborar.
- Imágenes de respaldo para pantallas pequeñas, dispositivos sin WebGL y preferencia de movimiento reducido.
- Diseño responsive, navegación móvil y estados de foco visibles.

## Tecnología

- React 19 + TypeScript
- Vite
- Tailwind CSS 4 (`@tailwindcss/vite`) para el hero; tokens de color y animaciones en `src/index.css`
- CSS propio para las secciones posteriores (`src/sections.css`), cargado en la capa `components` de Tailwind
- React Three Fiber + Drei + Three.js (carga diferida: no bloquea el primer render del hero)
- Motion para animaciones vinculadas al scroll y entrada en viewport
- Lucide React para iconografía
- React Icons para las redes sociales del equipo
- Inter Variable autoalojada con `@fontsource-variable/inter`
- Oxlint
- glTF Transform como herramienta de optimización de modelos

Los modelos ya optimizados se conservan como archivos finales. La herramienta de optimización no forma parte de las dependencias necesarias para compilar o desplegar la web.

## Activos 3D


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
│   │   ├── fondo.webp               # Paisaje del hero
│   │   ├── logo-terragrid.webp      # Logotipo (letras blancas, fondo transparente)
│   │   ├── problem-1..3.webp        # Fotografías de las tarjetas de «El problema»
│   │   └── terragrid-machine.webp   # Cámara TERRAGRID con fondo transparente
│   ├── components/    # Navbar, Hero, SensorCard, StatsPanel, Logo,
│   │                  # Reveal, ProductStage y ProductCanvas (3D diferido)
│   ├── sections/      # Problema, líneas de producto, sistema, validación,
│   │                  # mercado, modelo, equipo, CTA y footer
│   ├── data/content.ts # Textos y datos de las secciones
│   ├── App.tsx
│   ├── index.css      # Tailwind, tokens y estilos del hero
│   ├── sections.css   # Estilos de las secciones posteriores
│   └── main.tsx
├── index.html
└── package.json
```

## Créditos de imágenes

- `fondo.webp`: paisaje andino del hero, aportado por el equipo.
- `hero-andes.webp`: fotografía del Illimani desde La Paz por [Azzedine Rouichi](https://unsplash.com/photos/No6mIqzvq5o) en Unsplash (Licencia Unsplash). Ya no se usa en el hero.
- `terragrid-machine.webp`: recorte con fondo transparente de `public/products/terragrid-seed.png`.
- `logo-terragrid.webp`: recorte de `public/img/logo tearagrid.png` convertido a WebP.
- `problem-1.webp`, `problem-2.webp`, `problem-3.webp`: recortes horizontales (1.85:1) y conversión a WebP de `public/img/p1 pl.png`, `p2 pl.png` y `p3 pl.png`.

## Alcance actual

TERRAGRID se encuentra en preincubación y diseño/validación del MVP. La primera evidencia debe obtenerse comparando el sistema con un método de referencia y midiendo germinación, velocidad de emergencia, uniformidad, descarte, consumo de recursos, costo por plantín aceptado y supervivencia posterior al trasplante.

Universidad Mayor de San Andrés · La Paz, Bolivia · 2026.
