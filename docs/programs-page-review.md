# Programs page review

The Programs page is ready for the client to review its structure and interaction. Program names and existing images are retained as layout placeholders. No detailed program descriptions, current statuses, application calls, project funding claims, or external project addresses have been invented.

## Implemented structure

1. Existing pinned hero film with the approved Startup Programs copy and light in-page navigation.
2. A program explorer with a desktop index and detail panel, a mobile selector, keyboard navigation, and All Programs / Open / Ongoing / Past filters.
3. Existing airport film with the approved Global Reach copy, 03 Continents and 04 Markets.
4. A separate European and International Projects section, including the Visegrad name and confirmed Ongoing status.
5. Approved Your Next Opportunity copy and the existing Apply as Startup pathway.
6. The compact shared footer with contact/social links, copyright, Back to top, and Digital Den wordmark.

The brief gives conflicting positions for Projects. This implementation follows its final checklist: Projects comes after the airport block.

## Content fields

`src/lib/programsContent.ts` contains approved page copy and the typed program/project records. `order` controls display order independently of the UI. A future CMS can map its records to these types. This repository currently has no CMS or editor interface; changing the TypeScript content file still requires a rebuild. CMS editing and reordering without developer support remain unimplemented until a CMS is connected.

A program supports an overview, current status, market/location, format, duration, audience, program elements, partner/sponsor logos, gallery images, and an application call. Empty text is not replaced with invented facts. The review layout shows dashes for unconfirmed detail fields.

An application CTA requires Open status, an explicitly active call, and an HTTPS application URL. Optional opening and closing timestamps control availability in the browser, including when a statically exported page is already open. Ongoing and Past programs never show Apply Now. Current placeholder records have no confirmed status or active calls, so Apply Now is hidden.

A project supports title, description, period, status, partners, funders, funding acknowledgement, official external URL, and an optional image. Projects that require funding visibility show only a title/status placeholder until both the acknowledgement and funder logos are present. Supply the exact client-approved visibility material before releasing the full Visegrad module.

## Awaiting client content after layout approval

- Final program descriptions, current statuses, formats, durations, audiences, benefits, logos, and galleries.
- Confirmed application calls and their URLs/dates.
- Visegrad wording, project period, mandatory funding acknowledgement, funder/partner logos, and the official project URL.
- The CMS provider and connection details for editor-managed content and ordering.

The general Apply as Startup CTA uses the existing site modal. That pre-existing modal currently displays a local confirmation state; it has no backend submission endpoint.
