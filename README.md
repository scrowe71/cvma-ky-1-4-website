# CVMA® KY Chapter 1-4 Website

Concept website for Combat Veterans Motorcycle Association® Kentucky Chapter 1-4.

| Environment | Git branch | Cloudflare address | Who changes it |
|---|---|---|---|
| **Production** | `main` | `https://cvma-ky-1-4.pages.dev` | Nobody directly. Changes arrive only by an approved pull request from `dev`. |
| **Development** | `dev` | `https://dev.cvma-ky-1-4.pages.dev` | Every change goes here first. |

First-time setup: [docs/SETUP.md](docs/SETUP.md). Before making any change, read [docs/WORKFLOW.md](docs/WORKFLOW.md).

## Layout

```
site/        The website itself (what Cloudflare publishes). No build step.
tests/       Automated checks; run with: node tests/check.cjs
docs/        Workflow, setup and architecture notes
CHANGELOG.md Every production release, newest first
```

## Status

This is a concept demo. Google Calendar sync, officer login, shared photo storage and email delivery are simulated. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the production design.
