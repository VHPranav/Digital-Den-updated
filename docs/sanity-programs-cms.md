# Programs CMS

The Programs page reads published `startupProgram` and `internationalProject` documents from the
DigitalDen Sanity project (`inise1vg`, dataset `production`). The standalone Sanity Studio is in
`../studio-digitalden` and has matching document schemas. Its main content lists filter out
private, dotted-ID records and show only website-readable documents.

## Edit content

From the GitHub parent folder, start the Studio with:

```sh
cd studio-digitalden
npm run dev
```

Open the local Studio URL printed by Sanity, sign in with the Digital Den account, and publish
changes. To host the Studio on Sanity, run `npm run deploy` from the Studio folder and choose a
Studio hostname when prompted.

## Reorder programs

In Sanity Studio, open **Startup program** and edit each program's **Display order**.
Lower numbers appear first. Use distinct numbers and leave gaps so you can insert
programs later. For example, if Startup Readiness is at `10` and the next two
programs are at `20` and `30`, change Startup Readiness to `25` and publish it
to move it into second place.

## Add a project

In Sanity Studio, create a **European & international project** document. Set its
title, project ID, and **Display order**. Lower numbers appear first. Add the
project details and any required funder logos and acknowledgement, then publish.
The Projects carousel includes new published entries in display order without
any page code changes.

## Publish Programs page changes

The website is exported as static files for Cloudflare Pages. The Programs page queries the public
Sanity dataset during `next build`, so published CMS changes appear on the website at the next
successful site build/deployment. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and
`NEXT_PUBLIC_SANITY_DATASET` only if deploying this app against a different project or dataset;
defaults point to DigitalDen production. If anonymous reads are disabled for the dataset, the
build can use a read-only `SANITY_READ_TOKEN`. Keep it server-side: add it to `.env.local` locally
and as a Cloudflare Pages secret for production. Never prefix it with `NEXT_PUBLIC_` or commit it.

The production dataset was empty when integration began. Five editable placeholder documents were
created using the existing program/project names. Program descriptions, statuses, images, partner
logos, and application links remain blank until Digital Den supplies or confirms them. The Visegrad
Project remains gated until its funder logos and acknowledgement are entered.

Sanity treats any document ID containing a dot as private. The first seed attempt used dotted IDs,
so those five private duplicates remain in the dataset but are hidden from the Studio's main lists
and ignored by the public website query. The website uses the corrected root-level records, which
are anonymously readable from the public production dataset. No API token is needed.
