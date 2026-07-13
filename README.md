# Masarat — مسارات

حوّل محادثاتك وقراراتك إلى مسارات مرئية، خطط قابلة للتنفيذ، ونتائج يمكنك تتبعها.

Masarat is a local-first decision and plan tracker. It does not include an AI API, accounts, a backend, or cloud storage. Any external AI can prepare a structured `.masarat` file; the application validates it, visualizes it, and tracks what happens next.

## MVP features

- Arabic RTL interface with responsive desktop and mobile layouts.
- Interactive horizontal decision canvas with zoom, pan, filters, and details.
- Qualitative probability, confidence, impact, risk mitigation, and early signals.
- Select and highlight a path without deleting alternative branches.
- Task progress, priorities, actual costs, and notes.
- Assumptions and review checkpoints.
- Reality timeline for observations, expenses, and actual results.
- “Something changed” workflow with automatic plan snapshots.
- `.masarat` / `.json` import validation and safe update comparison.
- Stable-ID merge that preserves completed work, costs, and notes.
- Version restore, full backup export, and an external-AI update package.
- IndexedDB local persistence and installable offline PWA support.
- Bundled G3 Pro transport decision example.

## Stack

React, TypeScript, Vite, React Flow, Zustand, Dexie, Zod, Framer Motion, and Vitest.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

## Verify

```bash
npm run lint
npm test
npm run build
```

## File format

See [docs/masarat-file-format.md](docs/masarat-file-format.md) and [the importable example](public/examples/g3-pro-plan.masarat).

All user data remains in the browser's IndexedDB until the user explicitly exports a file.
