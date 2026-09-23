# MSMT Nepal website

Responsive six-page website and Payload CMS starter for **Medical Services Management Trust Nepal (MSMT Nepal)**. It uses Next.js App Router, TypeScript, Tailwind CSS, Payload, and PostgreSQL. The public site uses neutral CSS illustrations because no approved logo or MSMT photographs were present in the supplied assets.

## Selected runtime and package versions

- Node.js `22.23.2` (the requested hosting runtime)
- npm `>=10`
- Next.js `15.4.11`, React `19.1.1`, TypeScript `5.9.3`, Tailwind CSS `4.1.14`
- Payload `3.80.0` and matching `@payloadcms/*` packages `3.80.0`
- PostgreSQL adapter: `@payloadcms/db-postgres` `3.80.0`

Versions are pinned in `package.json`; `package-lock.json` was generated with npm `10.9.9` for reproducible installs. The local build environment used Node.js 24.19.0; Babal.host’s target runtime is Node.js `22.23.2`.

## Local setup

1. Install Node.js `22.23.2`, npm 10+, and PostgreSQL.
2. Create a PostgreSQL database and a restricted application user. Set `DATABASE_URL` to a URL such as `postgres://USER:PASSWORD@HOST:5432/DATABASE` (URL-encode special characters in credentials).
3. Copy `.env.example` to `.env.local`. Generate a unique random `PAYLOAD_SECRET` and configure the database URL. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` for local preview.
4. Run `npm ci`, then `npm run dev`.
5. Visit `http://localhost:3000/admin`. Payload prompts you to create the first administrator; there is no default account or password.
6. In a second terminal, run `npm run seed` to create editable draft page and service records. The command does not overwrite existing content. Review drafts in the CMS before publishing.

The Payload config uses development schema push locally. Production uses migrations (`push: false`). Generate migration files with `npm run payload -- migrate:create`, inspect and commit them, then apply with `npm run migrate` against the intended database. Back up the database before production migrations.

## Site structure and content

Public routes: `/`, `/about`, `/our-team`, `/services`, `/media`, and `/contact`. Published media items have detail pages at `/media/[slug]`. The CMS is at `/admin`.

Payload collections: pages and reusable sections, services and statuses, team members, media items, uploads, users, and contact inquiries. Site-wide details are in the Site Settings global. Editors can edit content; only administrators can delete records or manage users. Editorial collections support drafts. The initial contact and service values are editable in `src/lib/site.ts` and `content/seed.json`.

The supplied concept and planning brief had no staff names, biographies, approved photography, or approved media stories. Those collections start empty. The metrics and quality / certification references in `content/seed.json` are clearly marked for verification. No logo, partner logos, testimonials, or certification artwork are fabricated.

## Contact form

The contact endpoint validates inputs server-side, uses a honeypot and a basic per-process rate limit, stores submissions in PostgreSQL, and emails the configured contact address over SMTP when configured. Production must have working SMTP values in the app environment (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `CONTACT_TO`). The in-memory rate limit resets on restart and is per process; use a shared rate-limit service if hosting multiple app processes. The form asks for basic contact details and warns users not to submit health records; it is not for urgent care.

## Build and run

```sh
npm ci
npm run build
npm run start
```

The cPanel startup file is `app.js`, which starts the Next.js server using the port supplied by the Node application environment. Do not use a static export: both the website and Payload require a running Node.js process.

## Environment and file storage

`.env.example` lists variable names only. Never commit `.env.local`, real credentials, database dumps, or private uploads. On cPanel, configure environment variables through Setup Node.js App. Keep `UPLOAD_DIR` outside a temporary deployment/build directory and ensure the Node app user can write there. For example, ask Babal.host to confirm whether a persistent path under the account home directory is supported. A compatible S3 storage adapter can replace local storage if configured later.

## Deploy to Babal.host

Follow [Babal.host cPanel deployment](DEPLOYMENT-BABAL-HOST.md). The included `.cpanel.yml` expects the Git checkout itself to be the application root, builds the Next.js/Payload app, and requests a Passenger restart. Confirm the actual application root and restart mechanism in the account before enabling the deployment hook.

## Assumptions before public launch

- Confirm official contact details, map pin, service statuses, and the source/date behind all brochure figures and quality claims.
- Confirm SMTP delivery, upload persistence, database connection, cPanel Node.js Selector support, and the domain mapping with Babal.host.
- Supply approved logo files, brand rules, staff profiles and consented photos, and approved media. Replace the CSS artwork with approved imagery as available.
- Confirm editorial owners and inquiry handling workflow.

No deployment, production login, repository commit, or remote push has been performed.
