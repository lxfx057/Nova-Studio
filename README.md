# Nova Studio

A visual, browser-based website and app builder. Design screens with draggable blocks, edit their properties, preview desktop/mobile layouts, and save projects locally.

## Features

- Visual block editor with drag-and-drop ordering
- Components: headings, text, buttons, images, cards, dividers, spacers
- Live canvas with desktop and mobile preview modes
- Inspector for content, typography, colors, spacing, and alignment
- Layers panel with selection, duplication, and deletion
- Undo/redo history
- Autosave to browser local storage
- Export and import projects as JSON
- Export a standalone HTML page
- Responsive dark interface

## Run locally

Requirements: Node.js 20+

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Data and privacy

Projects are stored in the current browser using localStorage. They are not uploaded to a server. Export a JSON backup to move projects between browsers.

## Status

Nova Studio is an actively evolving MVP. The editor and project workflow run in the browser; hosted collaboration, cloud sync, and production publishing are not included yet.
