# Venue Outreach API

A small REST API for filling the venue outreach list programmatically — e.g. an
AI agent researches cafes/spaces and POSTs them in, then you pick which to DM,
edit the message, and adjust status in the admin dashboard (`/admin` → Venues).

It's an MCP-friendly plain HTTP/JSON API: hand this doc to any AI chat/agent that
can make HTTP requests (or wrap it in a generic HTTP MCP server).

## Base URL

```
https://incredible-pig-56.convex.site
```

(This is the Convex **HTTP actions** domain — `.convex.site`, not `.convex.cloud`.
For a different deployment, use that deployment's `convex.site` URL.)

## Auth

Send a bearer token on every request:

```
Authorization: Bearer <YOUR_API_KEY>
```

**Getting a key (recommended): per-admin, self-serve.** Each admin opens the
dashboard → **API Access** tab and clicks *Generate API key*. That tab also shows
a ready-to-paste agent brief with your key + base URL already filled in. Keys are
individually revocable (Revoke / Regenerate) — onboarding a new admin just means
they generate their own.

**Optional master key.** A deployment-wide `ADMIN_SECRET` env var also works as a
bearer token, useful for server-to-server scripts:

```bash
npx convex env set ADMIN_SECRET "<a-long-random-string>"
```

If neither any per-admin key nor `ADMIN_SECRET` exists (local dev), the API is
open and the header is optional. As soon as one key exists, auth is enforced.

## Fields

| field           | type   | notes                                                            |
| --------------- | ------ | ---------------------------------------------------------------- |
| `name`          | string | **required** on create                                          |
| `description`   | string | blurb — vibe, why it fits, hours, capacity                       |
| `contactHandle` | string | contact person / generic DM handle                              |
| `email`         | string |                                                                  |
| `phone`         | string |                                                                  |
| `instagram`     | string | `@handle` or full URL                                            |
| `threads`       | string | `@handle` or full URL                                            |
| `website`       | string |                                                                  |
| `googleMaps`    | string | Maps URL or just a place name                                   |
| `platform`      | enum   | `instagram` `threads` `whatsapp` `email` `phone` `facebook` `other` |
| `message`       | string | the DM you sent / plan to send                                  |
| `eventName`     | string | which event this venue is for                                   |
| `status`        | enum   | `to_contact` `dm_sent` `responded` `negotiating` `secured` `no_response` `declined` (default `to_contact`) |
| `assignedTo`    | string | collaborator handling it                                        |
| `notes`         | string | internal notes                                                  |

Unknown fields are ignored. Bad enum values return `400` with a message listing
the allowed values.

## Endpoints

### `GET /api/venues[?includeHidden=true]`
List venues with their `id` and all fields. Use this first so the agent can skip
venues that already exist.

```bash
curl https://incredible-pig-56.convex.site/api/venues \
  -H "Authorization: Bearer $ADMIN_SECRET"
```
→ `{ "count": 12, "venues": [ { "id": "...", "name": "...", "status": "...", ... } ] }`

### `POST /api/venues`
Create one venue (object) or many (an array, or `{ "venues": [...] }`). Only
`name` is required.

```bash
curl -X POST https://incredible-pig-56.convex.site/api/venues \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '[
    {"name":"VCR","description":"Popular brunch cafe, busy weekends, quieter weekday mornings","instagram":"@vcr.my","website":"https://vcr.my","platform":"instagram"},
    {"name":"REXKL","description":"Heritage event space, fits 100+","email":"hello@rexkl.com","googleMaps":"REXKL Kuala Lumpur"}
  ]'
```
→ `{ "created": 2, "ids": ["...","..."], "errors": [] }`
(Partial failures come back in `errors: [{ index, error }]` with HTTP `207`.)

### `PATCH /api/venues?id=<id>`
Update any subset of fields (plus `hidden`). This is what you'd use to edit the
message or move the status.

```bash
curl -X PATCH "https://incredible-pig-56.convex.site/api/venues?id=<id>" \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"status":"dm_sent","message":"Hi VCR! We run Build for Public..."}'
```

### `DELETE /api/venues?id=<id>`
Permanently remove a venue. (In the dashboard, "Hide" is the soft alternative —
`PATCH` with `{"hidden": true}`.)

## Suggested agent workflow

1. `GET /api/venues` → note existing names to avoid duplicates.
2. Research cafes/spaces; for each gather name, a short description, IG/Threads
   handle, email, website, and Google Maps.
3. `POST /api/venues` the new ones (bulk array) with `status: "to_contact"`.
4. Hand off to the human: in `/admin` → **Venues**, pick which to DM, insert a
   template, edit the message, and set the status — or do it over the API with
   `PATCH`.
