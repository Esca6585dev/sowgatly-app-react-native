# CLAUDE.md — Sowgatly mobile (Expo / React Native)

Read `README.md` first. The API lives in `Esca6585dev/sowgatly`; its `README.md` lists every
endpoint and `PROMPT.md` (Phase 4.5) lists the screens still to wire to the new API.

## Model routing (save Fable / Opus limits)

Start sessions on **Opus 5.5** (`/model claude-opus-5-5`).

| Work | Who |
|---|---|
| Find a screen, list API calls, check what a component does | `scout` (Haiku 4.5) |
| Build or wire a screen to a spec'd endpoint, translations, README | `builder` (Opus 5.5) |
| App architecture, navigation/state redesign, a bug that resisted two attempts | `architect` (Fable 5.1) |

## Delegation

- Do it yourself when it touches 1–3 known files.
- One sub-agent per independent task, independent ones in parallel.
- Give exact paths, the check to run and what to return; ask for a short summary.

## Project rules

- All HTTP goes through `apiRequest()` in `src/config/api.js`; never hard-code the API URL.
- Every user-visible string goes into `src/locales/tm.json`, `ru.json`, `en.json` (Turkmen first).
- Do not change backend response expectations without checking the backend README.
- Never commit `node_modules/`, release keystores or `.env*.local`.
- The owner merges straight to `main`; commit per feature with an English message.
