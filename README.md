# mobile-toolbelt

Cross-platform mobile app automation CLI monorepo (Node.js + TypeScript + pnpm workspaces).

## Requirements

- Node.js 20+
- pnpm

## Install

```bash
corepack enable
pnpm install
```

## Workspace layout

- `apps/cli`: executable npm CLI (`mobile-toolbelt`)
- `packages/core`: shared CLI helpers (errors, fs helpers, logging)
- `packages/ios`: iOS commands and services (MVP icon generation)
- `packages/android`: Android command placeholder
- `packages/shared`: shared cross-platform utilities

## Development

```bash
pnpm dev -- --help
```

## Build

```bash
pnpm build
```

## Test

```bash
pnpm test
```

## Lint

```bash
pnpm lint
```

## MVP usage

Generate iOS AppIcon assets from a single 1024x1024 PNG:

```bash
mobile-toolbelt ios icons generate --input ./icon.png --output ./Assets.xcassets/AppIcon.appiconset
```

## Command structure

- `mobile-toolbelt ios icons generate`
- `mobile-toolbelt ios plist inspect`
- `mobile-toolbelt ios version bump`
- `mobile-toolbelt android icons generate`

## Libraries

Used now:
- `sharp` (image processing)
- `commander` (CLI)
- `zod` (validation)
- `vitest` (tests)
- `eslint` + `prettier`
- `tsup` (build)

Documented for planned phases:
- `plist`
- `xcode`
- `app-store-connect-api` (or JWT-based App Store Connect REST client)
- `fast-glob`
- `execa`
- `consola` or `pino`
