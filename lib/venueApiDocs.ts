// Builds a self-contained, copy-pasteable brief for an AI agent to fill the
// venue outreach list over the HTTP API. The admin's own key + the deployment
// base URL are baked in, so it's ready to paste straight into a chat.

export function buildVenueApiDocs(baseUrl: string, apiKey: string): string {
  const base = baseUrl || "https://<your-deployment>.convex.site";
  const key = apiKey || "<GENERATE_YOUR_API_KEY_IN_THE_DASHBOARD>";
  return `# Task: fill the Build for Public venue outreach list

You are helping research event venues (cafes, coworking/event spaces) for Build
for Public and adding them to our outreach tracker via a REST API.

## API

Base URL: ${base}
Auth header (send on every request): Authorization: Bearer ${key}

### Endpoints
- GET  /api/venues                 → list existing venues (use first, to avoid duplicates)
- POST /api/venues                 → create one venue (object) or many (array)
- PATCH /api/venues?id=<id>        → update fields on a venue
- DELETE /api/venues?id=<id>       → remove a venue

### Venue fields
- name (required), description, contactHandle, email, phone,
  instagram (@handle or URL), threads (@handle or URL), website,
  googleMaps (URL or place name), eventName, message, notes
- platform: one of instagram | threads | whatsapp | email | phone | facebook | other
- status:   one of to_contact | dm_sent | responded | negotiating | secured | no_response | declined
  (defaults to "to_contact" on create)
- amenities (all optional): wifi, plugs, projector, parking, tables (booleans),
  maxOccupant (number) — set the ones you can confirm; leave the rest out

## What to do
1. GET /api/venues and note the names that already exist — don't re-add them.
2. Research venues that fit (good vibe, space for ~20-30 people, decent wifi).
   For each, gather: name, a one-line description, Instagram and/or Threads
   handle, email, website, and a Google Maps link or place name.
3. POST them in as a JSON array with status "to_contact". Do NOT write the DM
   message — a human picks which to contact and edits the message in the dashboard.

## Example

\`\`\`bash
curl -X POST "${base}/api/venues" \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '[
    {
      "name": "VCR",
      "description": "Popular brunch cafe in Bukit Bintang; quieter on weekday mornings",
      "instagram": "@vcr.my",
      "website": "https://vcr.my",
      "googleMaps": "VCR Kuala Lumpur",
      "platform": "instagram"
    }
  ]'
\`\`\`

Response: { "created": 1, "ids": ["..."], "errors": [] }

If a field value is rejected (e.g. a bad platform/status), the API returns 400
with a message listing the allowed values — fix it and retry.
`;
}

export function buildNonprofitApiDocs(baseUrl: string, apiKey: string): string {
  const base = baseUrl || "https://<your-deployment>.convex.site";
  const key = apiKey || "<GENERATE_YOUR_API_KEY_IN_THE_DASHBOARD>";
  return `# Task: fill the Build for Public NGO outreach list

You are helping research non-profits to cold-DM (offering to build them free
digital projects) and adding them to our outreach tracker via a REST API.

## API

Base URL: ${base}
Auth header (send on every request): Authorization: Bearer ${key}

### Endpoints
- GET  /api/nonprofit-leads        → browse our imported lead catalog (read-only)
- GET  /api/nonprofit-outreach     → list outreach records already added (avoid duplicates)
- POST /api/nonprofit-outreach     → add one record (object) or many (array)
- PATCH /api/nonprofit-outreach?id=<id>  → update fields
- DELETE /api/nonprofit-outreach?id=<id> → remove a record

### Two ways to add a record
1. From a known lead: include its \`leadKey\` (from /api/nonprofit-leads) — the
   org name, socials, and website are copied over automatically.
2. Brand new org: include \`orgName\` and whatever you found.

### Fields
- leadKey (optional), orgName (required unless leadKey given), description,
  instagram, facebook, twitter, linkedin, website, location, email, phone,
  message, requirementDocLink, notes
- platform: instagram | facebook | whatsapp | email | linkedin | twitter | other
- status:   to_contact | dm_sent | responded | in_discussion | requirement_received | secured | no_response | declined
  (defaults to "to_contact")

## What to do
1. GET /api/nonprofit-outreach → note org names already added; skip them.
2. (Optional) GET /api/nonprofit-leads?hasInstagram=true&websiteStatus=none to
   find leads worth contacting (e.g. orgs with no/dead website but an active IG).
3. Research each org: a one-line description, Instagram/socials, website (if any),
   email, phone. Don't write the DM — a human edits the message in the dashboard.
4. POST them in (array) with status "to_contact".

## Example

\`\`\`bash
curl -X POST "${base}/api/nonprofit-outreach" \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '[
    { "leadKey": "https://www.hati.my/some-ngo/" },
    {
      "orgName": "Helping Hands KL",
      "description": "Small food-aid charity, very active on IG, no website",
      "instagram": "@helpinghands.kl",
      "websiteStatus": "none",
      "email": "hello@helpinghands.kl"
    }
  ]'
\`\`\`

Response: { "created": 2, "ids": ["...","..."], "errors": [] }
`;
}
