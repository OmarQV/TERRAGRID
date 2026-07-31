# 🌱 TERRAGRID — Landing Page

> **Producción de alimentos en ambiente controlado para territorios con clima extremo, energía inestable y baja conectividad.**

Landing page interactiva con escena 3D del nodo TERRAGRID ambientado en el altiplano boliviano. Construida con React, Three.js y Vite.

---

## ✨ Características principales

| Característica | Descripción |
|---|---|
| **Escena 3D interactiva** | Modelo GLB del nodo desplegable con terreno, montañas, rocas y vegetación generados proceduralmente |
| **Hotspots informativos** | 6 puntos interactivos sobre el modelo (SMR, Solar, Hidropónico, H₂O, IA, IoT) con panel lateral |
| **Modo foco** | Vista limpia solo del modelo 3D para exploración libre con OrbitControls |
| **Post-processing** | Bloom y tone mapping ACES Filmic para iluminación cinematográfica de atardecer altiplánico |
| **Secciones de contenido** | Problema, Arquitectura del nodo (6 módulos), Impacto (social/ambiental/tecnológico), Mercado objetivo, Equipo |
| **Responsive** | Adaptado a desktop y dispositivos móviles |

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + TypeScript 6
- **Build tool:** [Vite 8](https://vite.dev/)
- **3D:** [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Drei](https://drei.docs.pmnd.rs/) + [Three.js](https://threejs.org/)
- **Post-processing:** [@react-three/postprocessing](https://docs.pmnd.rs/react-postprocessing/)
- **Íconos:** [Lucide React](https://lucide.dev/)
- **Linter:** [Oxlint](https://oxc.rs/)

---

## 📂 Estructura del proyecto

```
Terra-Grid/
├── public/
│   ├── blender/          # Modelos 3D (.glb) del nodo TERRAGRID
│   ├── equipo/           # Fotografías del equipo
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx           # Componente principal (escena 3D + secciones)
│   ├── App.css           # Estilos globales de la landing
│   ├── index.css         # Reset y variables CSS base
│   ├── main.tsx          # Entry point de React
│   └── assets/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
└── README.md
```

---

## 🚀 Instalación y desarrollo

### Requisitos previos

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Clonar e instalar

```bash
git clone https://github.com/OmarQV/TERRAGRID.git
cd TERRAGRID
npm install
```

### Servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build de producción

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🧊 Modelo 3D

El modelo activo del nodo es `public/blender/v2 eva pr6.glb` (~42 MB). Se carga de forma diferida con `Suspense` y se escala automáticamente para ocupar un footprint de 6 unidades en la escena.

La escena incluye elementos procedurales generados con funciones determinísticas (sin `Math.random`):

- **Terreno:** Plano de tierra ocre
- **Montañas:** 7 conos con cumbres nevadas
- **Rocas:** 48 dodecaedros dispersos
- **Vegetación:** 70 conos que simulan paja brava

---

## 🏗️ Arquitectura de la aplicación

```
App
├── TerragridScene (Canvas R3F)
│   ├── Iluminación (ambient + 3 directional)
│   ├── AltiplanoTerrain
│   ├── MountainRange
│   ├── ScatteredRocks
│   ├── DryGrass
│   ├── ContactShadows
│   ├── TerragridModel (GLB + Hotspots)
│   ├── OrbitControls
│   └── EffectComposer (Bloom)
├── Hero Section (título + CTA)
├── Hotspot Panel (panel lateral dinámico)
├── Problema (5 pasos narrativos)
├── Módulos (6 tarjetas técnicas)
├── Impacto (3 pilares: social, ambiental, tecnológico)
├── Mercado objetivo (8 segmentos)
├── Equipo (4 integrantes)
└── CTA final
```

---

## 👥 Equipo

| Integrante | Rol |
|---|---|
| **Omar Quispe Vargas** | Liderazgo, estrategia, modelo de negocio y seguridad |
| **Carol Katerine Canqui** | Datos, inteligencia artificial y validación |
| **Jhamil Calixto Mamani** | UI/UX, frontend, diseño visual e identidad |
| **Saúl Mijael Choquehuanca** | Backend, arquitectura técnica y blockchain |

> Universidad Mayor de San Andrés · Carrera de Informática · ElevateU 2026

---

## 📄 Licencia

Proyecto académico — ElevateU 2026. Todos los derechos reservados.
