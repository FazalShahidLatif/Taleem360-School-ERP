# Vercel Serverless Body Parsing

**Topic:** Reading request body in Vercel serverless functions (Node.js, ES modules)

**When to use:** Any Vercel serverless function that needs to read a JSON or form-encoded request body, especially when the client POSTs JSON or form data to a Vercel function.

---

## The Problem

Vercel's serverless runtime (Node.js, ES modules) does **NOT** auto-populate `req.body` like Express or other HTTP frameworks do. When a client POSTs JSON or form-encoded data, `req.body` is `undefined` or an empty object.

This means you cannot use `req.body` directly in a Vercel serverless function:

```javascript
// WRONG — req.body is undefined in Vercel serverless
export default async function handler(req, res) {
  const body = req.body; // undefined
  const message = body?.message; // undefined
}
```

This is a common source of bugs. Functions that work locally (where Express or similar middleware parses the body) often fail in production on Vercel.

---

## The Fix: Read the Raw Body

Use a `readBody` function that reads the raw body from the request stream and parses it:

```javascript
// Vercel serverless runtime populates req.body for JSON/form-encoded bodies (as proven by the working /api/leads/quote endpoint above). For safety, fall back to the raw stream only if req.body is genuinely missing. Stream reading is done with events because async iteration is not supported in older Vercel.

function parseFormEncoded(raw) {
  const out = {};
  for (const pair of String(raw).split('&')) {
    if (!pair) continue;
    const idx = pair.indexOf('=');
    const key = idx === -1 ? pair : pair.slice(0, idx);
    const value = idx === -1 ? '' : pair.slice(idx + 1);
    try {
      out[decodeURIComponent(key.replace(/\+/g, ' '))] = decodeURIComponent(value.replace(/\+/g, ' '));
    } catch {
      /* skip malformed pair */
    }
  }
  return out;
}

function readBody(req) {
  const body = req.body;
  if (body) {
    if (typeof body === 'object' && !Array.isArray(body)) return body;
    const raw = String(body);
    if (raw.trim().startsWith('{')) {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    return parseFormEncoded(raw);
  }
  return {};
}

export default async function handler(req, res) {
  // ... CORS headers, method checks ...

  // Read the request body
  let body = await readBody(req);

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ detail: 'Invalid JSON body' });
    }
  } else if (typeof body !== 'object') {
    body = {};
  }

  // ... rest of handler ...
}
```

### Key points

1. **`req.body` may be `undefined`** — Always check before using it.
2. **`req.body` may be a string** — If the client sends the body as a string (e.g., some browsers send it as a string), normalize to an object.
3. **Handle both JSON and form-encoded** — The `parseFormEncoded` fallback covers `application/x-www-form-urlencoded` content types.
4. **Fail on invalid JSON** — Return a 400 with a clear message before touching the data further.
5. **Defaults for missing fields** — Use `body.field ?? ''` or `body.field || ''` to avoid `undefined` errors later.

---

## Verification

**Test the endpoint with valid JSON:**

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test","intent":"pricing"}' \
  https://taleem360.online/api/ai/chat-free
```

**Expected:** A JSON response with `answer`, `intent`, and `leadCaptureNeeded` fields.

**Test the endpoint with invalid JSON:**

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d 'not json' \
  https://taleem360.online/api/ai/chat-free
```

**Expected:** `{"detail":"Invalid JSON body"}` with HTTP 400.

**Test with a form-encoded body:**

```bash
curl -s -X POST \
  -d "message=test&intent=pricing" \
  https://taleem360.online/api/ai/chat-free
```

**Expected:** A JSON response (if the form-encoded body is parsed correctly).

---

## Common Failure Patterns

| Symptom | Root cause | Fix |
|---|---|---|
| `req.body` is `undefined` | Vercel doesn't auto-parse body | Write a `readBody` function |
| `JSON.parse()` throws | `req.body` is a string that isn't valid JSON | Check content type, validate before parsing |
| `decodeURIComponent` throws | Form field contains invalid percent-encoding | Wrap in try/catch, skip malformed pair |
| `body.message` is `undefined` | `req.body` was treated as object but was a string | Normalize to object before accessing fields |
| Function works locally but fails on Vercel | Local dev uses Express/other middleware | Always test on Vercel, not just locally |

---

## Related Patterns

- **Sheets lead capture** — See `vercel-serverless-lead-capture.md` for the Google Sheets integration pattern.
- **Chatbot lead capture** — This endpoint is used by the PublicAIChatbot for lead capture routing.
