# TERRAGRID

Sitio oficial del nuevo rumbo de **TERRAGRID**, una startup AgroTech boliviana que desarrolla incubación agrícola inteligente para obtener plantines uniformes, medibles y trazables.

La narrativa sigue el roadmap real del proyecto:

1. **TERRAGRID SEED — MVP actual:** germinación y producción inicial de plantines. El piloto prioriza perejil; lechuga sirve como referencia técnica y tomate se trabaja hasta plantín para trasplante.
2. **TERRAGRID GROW — siguiente etapa:** crecimiento y producción hidropónica compacta, inicialmente para lechugjsjsa, perejil y otros cultivos de hoja.
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
- Lenis + GSAP ScrollTrigger, sincronizados en un único ticker, para scroll continuo y parallax
- GSAP SplitText para revelar líneas con máscaras, recalculadas al cambiar el ancho o cargar fuentes
- Motion para detectar la preferencia de movimiento reducido
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

El scroll se configura en `SmoothScroll`; `Parallax` y `Reveal` son reutilizables.
Las anclas mantienen sus URLs y el foco de teclado, con espacio para la navegación fija.
El táctil conserva la inercia nativa. No hay scroll por diapositivas ni snapping.

El roadmap comunica el progreso a Three.js sin renderizar React por fotograma.
Los modelos se cargan al acercarse a la sección, solo en escritorio con puntero preciso;
el canvas renderiza bajo demanda y permite arrastrar. En móvil cada etapa incluye su
propia imagen con capas suaves. Movimiento reducido desactiva Lenis, parallax,
revelaciones y 3D, conservando todo el contenido. Un fallo de WebGL/modelo mantiene
la imagen de respaldo.

La entrada del roadmap es una escena por capas (`SceneReveal`): la foto queda fija
(`position: fixed` recortada por el `clip-path` de la escena), «El problema» sube
y la destapa, y al final la capa de líneas de producto sube y la cubre. El velo, el
zoom y los títulos avanzan con `scrub` sobre el mismo reloj que Lenis; los títulos
salen de una máscara línea por línea (SplitText). El guion está en unidades de svh
y su largo total (310) debe coincidir con la altura de `.scene` en `sections.css`.
Con movimiento reducido la escena queda estática con el título visible.

El roadmap de productos (`ProductStory`) usa un escenario (`ProductStage`) sobre la plataforma
del fondo fotográfico: cada producto es su foto con fondo transparente
(`src/assets/product-*.webp`) y, si hay WebGL, una conexión razonable y no hay movimiento
reducido, su modelo 3D encima. El foco (0, 1, 2…) lo calcula el scroll y `smoothFollow` lo
suaviza en el reloj de GSAP/Lenis; el producto que sale se hunde en la plataforma (plano de
recorte) y el siguiente sube, sin solaparse. Se carga primero el modelo en foco y luego los
demás (11–21 MB cada uno). Los datos del panel lateral son ilustrativos y así se rotulan.

```bash
pnpm lint
pnpm build
```

Recorrido visual de aceptación (requiere navegador):

- Escritorio: rueda y trackpad desde el hero hasta el pie, volver hacia arriba y
  pasar SEED → GROW → SEED BANK en ambos sentidos; comprobar el navbar fijo,
  la cámara, el arrastre y la ausencia de saltos al cargar cada modelo.
- Anclas: probar el CTA, los tres controles del roadmap, una URL directa con
  `#grow`, Atrás/Adelante y el enlace de salto usando teclado.
- Móvil: 390 × 844 y 768 × 1024, menú, scroll táctil y rotación; comprobar que cada
  imagen acompaña su texto, no hay desborde y no se solicitan archivos `.glb`.
- Accesibilidad: activar y desactivar movimiento reducido durante la sesión;
  el contenido debe seguir visible y el scroll pasar a nativo sin cambiar posición.
- Red lenta/WebGL desactivado: el póster debe conservar el espacio y seguir visible.

## Estructura principal

```text
Terra-Grid/
├── public/            # Marca, equipo, modelos 3D y renders de producto
├── src/
│   ├── assets/
│   │   ├── fondo.webp               # Paisaje del hero
│   │   ├── logo-terragrid.webp      # Logotipo (letras blancas, fondo transparente)
│   │   ├── problem-1..3.webp        # Fotografías de las tarjetas de «El problema»
│   │   ├── scene-semilla.webp       # Escena fija del roadmap (plántula al amanecer)
│   │   ├── tec-fondo.webp           # Fondo del titular de «La capa inteligente»
│   │   ├── product-*.webp           # Fotos de producto con fondo transparente (SEED, GROW, SEED BANK)
│   │   ├── tec-1..5.webp            # Fotografías de las cinco capas de tecnología
│   │   └── terragrid-machine.webp   # Cámara TERRAGRID con fondo transparente
│   ├── components/    # Navbar, Hero, SensorCard, StatsPanel, Logo,
│   │                  # Reveal, SceneReveal, ProductStage y ProductCanvas (3D diferido)
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
- `scene-semilla.webp`: conversión a WebP de `public/img/scrolling.png` (escena fija del roadmap).
- `product-seed.webp`, `product-grow.webp`, `product-seed-bank.webp`: recorte al borde del equipo y conversión a WebP de `public/products/*-Photoroom.png`.
- `tec-fondo.webp` y `tec-1.webp` … `tec-5.webp`: conversión a WebP de `public/img/tec fond.png` y `tec1.png` … `tec5.png` (sección «La capa inteligente»; las cinco tarjetas se redimensionan a 800 px de ancho).
- `problem-1.webp`, `problem-2.webp`, `problem-3.webp`: recortes horizontales (1.85:1) y conversión a WebP de `public/img/p1 pl.png`, `p2 pl.png` y `p3 pl.png`.

## Alcance actual

TERRAGRID se encuentra en preincubación y diseño/validación del MVP. La primera evidencia debe obtenerse comparando el sistema con un método de referencia y midiendo germinación, velocidad de emergencia, uniformidad, descarte, consumo de recursos, costo por plantín aceptado y supervivencia posterior al trasplante.

Universidad Mayor de San Andrés · La Paz, Bolivia · 2026.
