# Agent Notes (core)

This repo publishes `@tsonic/core` from `versions/<dotnetMajor>/`.

## Branch Hygiene (IMPORTANT)

- Before starting work, and again before creating a new branch, run:
  - `bash scripts/check-branch-hygiene.sh`
- Do not proceed if that script reports warnings unless the maintainer explicitly says to ignore them for the current task.
- Keep this repo on `main` unless it is the one active PR branch.
- Do not leave local feature/release branches behind after they are merged.

## Publishing Workflow (no main/npm drift)

- **Do not publish from feature/release branches.** Always publish from `main`.
- If you need to regenerate:
  1) Run generation (e.g. `npm run generate:10`)
  2) Commit the regenerated output
  3) Merge to `main` (PR if required)
  4) Publish (e.g. `npm run publish:10`)
- If npm already has a version that `main` does not reflect:
  - First bump `main` to the next patch and publish from `main`.
  - Avoid publishing from non-main branches.

## Publish Need Verification (MANDATORY)

- Do not rely on version numbers alone when deciding whether publish is needed.
- Always verify both:
  - registry version drift, and
  - content drift since the last version-bump commit for the publishable package path.
- Treat `local == registry` plus content drift as a release bug that requires a version bump; do not silently skip publishing.
