# Masarat — مسارات

حوّل محادثاتك وقراراتك إلى مسارات مرئية، خطط قابلة للتنفيذ، ونتائج يمكنك تتبعها.

Masarat is a local-first personal Life Operating System built around decisions, context, execution, reality, and lessons. It does not include an AI API, accounts, a backend, or cloud storage. Any external AI can prepare a structured project or Life Pack; the application validates it, visualizes it, and tracks what happens next.

## MVP features

- Arabic RTL interface with responsive desktop and mobile layouts.
- Today control center that aggregates focus tasks and checkpoints across every project.
- Editable life areas and goals, with project-to-goal linking and archive workflows.
- Global timeline and functional weekly, monthly, and yearly reviews.
- Interactive horizontal decision canvas with zoom, pan, filters, and details.
- Qualitative probability, confidence, impact, risk mitigation, and early signals.
- Select and highlight a path without deleting alternative branches.
- Task progress, priorities, actual costs, and notes.
- Assumptions and review checkpoints.
- Reality timeline for observations, expenses, and actual results.
- “Something changed” workflow with automatic plan snapshots.
- `.masarat` / `.json` import validation and safe update comparison.
- Life Pack 2.0 import/export with conflict preview and stable-ID merging.
- Stable-ID merge that preserves completed work, costs, and notes.
- Version restore, full-database backup/restore, and an external-AI update package.
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

See [docs/masarat-file-format.md](docs/masarat-file-format.md) for project 1.0, Life Pack 2.0, and backup formats, plus the importable project example and [generic Life Pack template](public/examples/life-pack-template.json).

All user data remains in the browser's IndexedDB until the user explicitly exports a file.
