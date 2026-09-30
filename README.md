# Raj Aangan Events & Convention Centre

Website and content studio for Raj Aangan Events & Convention Centre.

## Requirements

- Node.js 20 or later
- npm 10 or later

## Local development

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000.

## Available commands

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run sanity
```

## Content management

The Sanity Studio is available at `/studio`. Content-editing guidance is in [docs/CMS_GUIDE.md](docs/CMS_GUIDE.md).

## Environment configuration

Copy `.env.local.example` to `.env.local` and provide the required Sanity credentials. Keep `.env.local` private; it is intentionally excluded from version control.
