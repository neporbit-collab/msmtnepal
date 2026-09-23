# Babal.host cPanel deployment guide

This project requires a persistent Node.js server. It is not a static export. The intended domain is `msmtnepal.com`, with the app served over HTTPS and Payload available at `/admin`.

## 1. Confirm the account setup

In cPanel, confirm that the hosting plan supports all of the following before scheduling launch:

- Setup Node.js App / Node.js Selector with Node.js `22.23.2` and npm 10 or later.
- A long-running Passenger-managed Node.js app, PostgreSQL access from that app, and writable persistent storage for uploads.
- A deployment hook that runs `.cpanel.yml` tasks and a documented way to restart the Node app after deployment.
- Resource limits sufficient for `npm ci` and `next build` on the hosting account. If builds exceed account limits, build in CI and deploy the compatible production artifact using a provider-supported process.

Babal.host’s setup guide describes Node applications in cPanel; exact interface labels and restart behavior can vary by account. Do not assume the Git hook can build or restart the application until this has been confirmed with the hosting provider.

## 2. Prepare the Node application

1. Create a private Git repository and push the reviewed source. Keep `.env*` secrets, backups, and production uploads out of Git.
2. In **Setup Node.js App**, create an application with Node.js `22.23.2`.
3. Set the application root to the Git deployment checkout (the directory containing `package.json`, `app.js`, and `.cpanel.yml`). For the current cPanel checkout path shown in File Manager, use `repositories/msmtnepal`. The deployment hook uses the same path.
4. Map `msmtnepal.com` to the application using the host’s supported domain / Passenger configuration. Enable HTTPS and redirect HTTP to HTTPS.
5. Set the startup file to `app.js`. The `start` script is `node app.js`; Passenger supplies the app port. Do not configure `public_html` as a static website directory for this Next.js/Payload server.
6. Select Node.js `22.23.2`, run `npm ci`, and run `npm run build`. If using the checked-in Git hook, confirm it runs from the app root and has enough memory/disk first.

Set `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL` before building. Confirm the Git deployment task receives these application environment values; if it does not, build through the cPanel Node application environment or use the provider-confirmed build procedure. Keep the deployment secret out of the task file and build logs.

## 3. Configure runtime environment variables

Use Setup Node.js App’s environment-variable interface. Do not put real secrets in `.cpanel.yml`, Git, or this guide.

- `DATABASE_URL`: PostgreSQL connection string, for example `postgres://USER:PASSWORD@HOST:5432/DATABASE`. Use the exact host, database name, user, and SSL options supplied by Babal.host; URL-encode special characters in the password.
- `PAYLOAD_SECRET`: long, randomly generated secret, unique to production.
- `NEXT_PUBLIC_SITE_URL`: `https://msmtnepal.com`.
- `UPLOAD_DIR`: persistent writable absolute directory outside temporary release/build folders. Confirm the exact account path with Babal.host and grant access to the Node app user. Back up this folder separately from the database.
- SMTP variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `CONTACT_TO`. Point `CONTACT_TO` to the authorized MSMT inquiry mailbox and validate sending before launch.

Never paste credentials into a support ticket or this repository. Use cPanel’s protected environment settings and Babal.host’s approved secret-handling process.

## 4. Database, admin, and uploads

Create a production PostgreSQL database and a least-privilege database user in cPanel, then set `DATABASE_URL`. Apply reviewed Payload migrations with `npm run migrate` as a deliberate release step. Take a database backup first. The first authorized staff member creates the administrator account from `/admin`; there is no hard-coded password. Create editor accounts only for approved staff.

Check that `UPLOAD_DIR` survives app restarts and code deployments. Test uploading an image and a PDF, then restart the app and confirm both remain available. If the account does not provide durable local storage, configure an S3-compatible upload adapter before publication.

## 5. Configure Git deployment

The included `.cpanel.yml` is tailored to this Node project. Its commands assume the checkout directory is also the application root at `~/repositories/msmtnepal`, dependencies are installed with the committed npm lockfile, and the Passenger restart marker is supported:

1. Connect cPanel Git Version Control to the private repository.
2. Keep `.cpanel.yml` at the repository root and ensure its deployment task is enabled.
3. Confirm the task runs from the application root and that cPanel permits dependency installation and production builds in that hook.
4. Confirm the hook’s `tmp/restart.txt` marker triggers the Node app restart. If Babal.host requires a separate button, CLI action, or path, update the task and this guide to use the host-confirmed method.
5. Deploy a staging change first and verify `/`, `/services`, `/media`, `/contact`, `/admin`, email delivery, the database, and an uploaded file.

If the Git working tree and application root differ, update the deployment task’s working and destination paths to the exact paths shown in cPanel. Do not copy the app into `public_html` as a static site.

## 6. Release and rollback outline

Before a release, record the current Git revision and back up PostgreSQL and persistent uploads. Apply only reviewed database migrations. Deploy the application code, confirm the restart, and check the public pages, admin login, contact submission, SMTP delivery, and media storage.

To roll back, restore the previous application revision and restart the app. Restore PostgreSQL only when a migration or data change requires it, using the matching backup and a compatible code revision. Restore uploads from the separate persistent-file backup if needed. Avoid rolling back the database independently of the application schema without checking migration compatibility.

Schedule encrypted off-account backups for PostgreSQL and uploads, retain multiple dated copies, and periodically confirm that a backup can be restored.

## 7. Host-specific items to confirm

- Exact Node.js Selector version label for `22.23.2` and app startup behavior for `app.js`.
- The app root, domain attachment, and whether the Git hook runs in that directory.
- Whether `.cpanel.yml` deployment can execute `npm ci`, build Next.js, and trigger Passenger restart.
- PostgreSQL hostname, SSL requirements, and connection limits.
- A persistent upload path or supported S3-compatible service.
- Build resource limits, log access, HTTPS renewal, and backup/restore procedure.

References: [Babal.host Node.js application guide](https://babal.host/blog/how-to-setup-install-and-deploy-your-node-js-application-with-babal-host/) and [cPanel Git deployment guide](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/).
