# TERRAGRID — Landing Page

Sitio oficial del nuevo rumbo de **TERRAGRID**, una startup AgroTech boliviana que desarrolla incubación agrícola inteligente para obtener plantines uniformes, medibles y trazables.

La narrativa sigue el roadmap real del proyecto:

1. **TERRAGRID SEED — MVP actual:** germinación y producción inicial de plantines. El piloto prioriza perejil; lechuga sirve como referencia técnica y tomate se trabaja hasta plantín para trasplante.
2. **TERRAGRID GROW — siguiente etapa:** crecimiento y producción hidropónica compacta, inicialmente para lechuga, perejil y otros cultivos de hoja.
3. **TERRAGRID SEED BANK — visión futura:** conservación distribuida de semillas, pruebas periódicas de viabilidad y apoyo a su regeneración.

La página distingue lo que pertenece al MVP, al roadmap y a la visión futura. No presenta resultados agronómicos aún no obtenidos ni describe la trazabilidad digital como una certificación oficial.

## Experiencia

- Hero editorial oscuro con la propuesta central: «El clima ya es incierto. El plantín no debería serlo».
- Relato por desplazamiento con un escenario 3D persistente y capítulos para SEED, GROW y SEED BANK.
- Modelos interactivos con rotación suave y controles mediante mouse o toque.
- Imágenes de respaldo para pantallas pequeñas, dispositivos sin WebGL y preferencia de movimiento reducido.
- Secciones de problema, arquitectura tecnológica, validación, mercado, modelo de negocio, equipo y llamado a colaborar.
- Bordes luminosos animados sin efectos que persigan el cursor.
- Diseño responsive, navegación móvil y estados de foco visibles.

## Tecnología

- React 19 + TypeScript
- Vite
- React Three Fiber + Drei + Three.js
- Motion para animaciones vinculadas al scroll y entrada en viewport
- Lucide React para iconografía
- Oxlint
- glTF Transform como herramienta de optimización de modelos

## Activos 3D

Los modelos entregados se optimizaron para web con compresión Draco y simplificación geométrica. Las versiones originales permanecen fuera del proyecto de producción; la aplicación utiliza:

| Línea | Ruta web | Tamaño aproximado |
| --- | --- | ---: |
| SEED | `public/models/terragrid-seed.glb` | 16,6 MB |
| GROW | `public/models/terragrid-grow.glb` | 11,7 MB |
| SEED BANK | `public/models/terragrid-seed-bank.glb` | 21,3 MB |

Los decodificadores Draco se sirven localmente desde `public/draco/`. Las imágenes conceptuales se encuentran en `public/products/` y funcionan como póster y alternativa visual.

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
├── public/
│   ├── draco/       # Decodificador local para los GLB comprimidos
│   ├── equipo/      # Fotografías del equipo
│   ├── models/      # Modelos web optimizados
│   └── products/    # Imágenes conceptuales de las tres líneas
├── src/
│   ├── App.tsx      # Contenido, interacción, 3D y secciones
│   ├── App.css      # Sistema visual y responsive
│   ├── index.css    # Base tipográfica, reset y variables
│   └── main.tsx
├── index.html
└── package.json
```

## Alcance actual

TERRAGRID se encuentra en preincubación y diseño/validación del MVP. La primera evidencia debe obtenerse comparando el sistema con un método de referencia y midiendo germinación, velocidad de emergencia, uniformidad, descarte, consumo de recursos, costo por plantín aceptado y supervivencia posterior al trasplante.

Universidad Mayor de San Andrés · La Paz, Bolivia · 2026.
