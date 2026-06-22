# Recruitment / Core-Team API (owner-only)

Lets the owner manage the committee/recruitment pipeline from an AI agent
(Claude Code, etc.) — read applicants, see the org structure, and advance the
recruitment pipeline. **Owner-only**, because applicant records contain PII
(emails, phone numbers, motivations).

## Auth

Send on every request:

```
Authorization: Bearer <OWNER_API_SECRET>
```

`OWNER_API_SECRET` is a Convex environment secret (set on dev + prod). Unlike the
per-admin venue/NGO keys, this endpoint is **never open** — a missing/wrong token
returns `401`, and a regular admin's `bfp_…` key is rejected.

> Rotate it anytime with:
> `npx convex env set --prod OWNER_API_SECRET <new-value>`
>
> Alternatively, once the Clerk "convex" JWT template includes
> `"email": "{{user.primary_email_address}}"`, the owner can regenerate their
> dashboard API key and it will be flagged `isOwner` — then that single `bfp_…`
> key works for both the venue/NGO and recruitment endpoints.

Base URL: `https://whimsical-dragon-531.convex.site`

## Endpoints

### `GET /api/recruitment/positions`
The core-team position catalog (org structure). Returns each position's
`id, department, level, title, commitment, summary, responsibilities,
roleQuestions, requiresPortfolio, filled`.

### `GET /api/recruitment/applicants`
List applicants with their full recruitment pipeline. Filters (query params):
- `status` = `new | contacted | accepted | declined`
- `recruitStatus` = `applied | shortlisted | invite_sent | interview_scheduled | interviewed | offered | accepted | declined | not_shortlisted`
- `position` = a position id (matches applied / shortlisted / finalOffer)
- `includeHidden=true`
- `id=<id>` → returns a single applicant under `{ applicant }`

Each applicant includes: identity/contact (name, email, phone, country, city,
linkedin, portfolio, github), application (about, motivation, positions ranked,
positionAnswers, hoursPerWeek, canCommit, role-specific extras), and the pipeline
(recruitStatus, shortlistedPositions, finalOffer, potential, interviewer,
interviewSlot, meetLink, inviteEmailSentAt, status, notes).

### `PATCH /api/recruitment/applicants?id=<id>`
Update an applicant's pipeline. Allowed fields: `recruitStatus`,
`shortlistedPositions` (array of position ids), `finalOffer` (position id),
`potential` (`low|moderate|high`), `interviewer`, `interviewSlot`, `meetLink`,
`inviteEmailSentAt` (epoch ms), `status`, `notes`, `hidden`.

Identity and application answers are read-only here (they come from the public
application form).

## Example

```bash
# Everyone who has accepted an offer
curl -s "https://whimsical-dragon-531.convex.site/api/recruitment/applicants?recruitStatus=accepted" \
  -H "Authorization: Bearer $OWNER_API_SECRET"

# Mark an applicant as offered the Events Director role
curl -s -X PATCH "https://whimsical-dragon-531.convex.site/api/recruitment/applicants?id=<id>" \
  -H "Authorization: Bearer $OWNER_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{ "recruitStatus": "offered", "finalOffer": "events-director" }'
```
