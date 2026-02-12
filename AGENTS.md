# Agent Notes (core)

This repo publishes `@tsonic/core` from `versions/<dotnetMajor>/`.

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
