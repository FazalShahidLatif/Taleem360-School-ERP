# Lead capture setup — quote and enquiry forms

**Status:** the code is complete and deployed. **One manual step remains**: creating the Google Sheet endpoint and setting one environment variable.

Until that variable is set, the form does **not** pretend to work. It shows the visitor an honest message and a working email address, and logs the cause server-side. That is deliberate — see "Why it fails loudly" below.

---

## What was built

| Piece | Path | Purpose |
|---|---|---|
| Lead endpoint | `api/leads/quote.js` | Validates, throttles, forwards to the sheet |
| Static form | rendered into `/pricing` by `scripts/static-content.ts` | Works with JavaScript disabled |
| React form | `components/QuoteForm.tsx` | In-app pricing screen, same endpoint |
| Contact form | `pages/Contact.tsx` | Now posts for real; previously discarded everything |
| Confirmation page | `public/thank-you.html` | No-JS success destination, `noindex` |

Both forms post to `/api/leads/quote`, so every lead lands in one place.

---

## Why it fails loudly

The contact form this replaces ended with:

```js
// Simulate API storage roundtrip
setTimeout(() => { setSubmitSuccess(true); }, 1200);
```

Every enquiry was silently thrown away while the visitor saw a success message. A school that believes it has been heard and never hears back is a lost customer — worse than a visible error, because nobody knows to chase it.

`api/leads/quote.js` only reports success after the sheet confirms the write. If `LEAD_WEBHOOK_URL` is unset, it returns **503** with a message pointing at `support@taleem360.online`, and logs the cause for you.

---

## Setup — about 10 minutes, free

### 1. Create the spreadsheet

1. Go to [sheets.new](https://sheets.new)
2. Name it **Taleem360 Leads**
3. Leave it empty — the script writes the header row itself

### 2. Add the Apps Script

1. In the sheet: **Extensions → Apps Script**
2. Delete the placeholder `myFunction` code
3. Paste the script below in full
4. Set `SHARED_SECRET` on line 2 to any long random string you choose (or leave it empty to skip the check)
5. **Save** (the disk icon)

```javascript
// Taleem360 lead receiver.
// Must match LEAD_SHARED_SECRET in the Vercel environment variables.
const SHARED_SECRET = ''; // paste the same value you put in Vercel

const SHEET_NAME = 'Leads';

const HEADERS = [
  'Received',
  'Type',
  'School / institution',
  'Contact name',
  'Email',
  'Phone / WhatsApp',
  'Country',
  'City',
  'Institution type',
  'Students',
  'Campuses',
  'White label',
  'Current system',
  'Message',
  'Page',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (SHARED_SECRET && data.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'unauthorised' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.formType || 'quote',
      data.institutionName || '',
      data.contactName || '',
      data.email || '',
      data.phone || '',
      data.country || '',
      data.city || '',
      data.institutionType || '',
      data.studentCount || '',
      data.campusCount || '',
      data.whiteLabel ? 'Yes' : 'No',
      data.currentSystem || '',
      data.message || '',
      data.page || '',
    ]);

    // Email alert so a lead is never missed.
    const subject =
      (data.formType === 'contact' ? 'Enquiry' : 'Quote request') +
      ' — ' +
      (data.institutionName || data.contactName || 'Taleem360');

    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: subject,
      body:
        'School: ' + (data.institutionName || '-') + '\n' +
        'Contact: ' + (data.contactName || '-') + '\n' +
        'Email: ' + (data.email || '-') + '\n' +
        'Phone: ' + (data.phone || '-') + '\n' +
        'Location: ' + [data.city, data.country].filter(Boolean).join(', ') + '\n' +
        'Type: ' + (data.institutionType || '-') + '\n' +
        'Students: ' + (data.studentCount || '-') + '\n' +
        'Campuses: ' + (data.campusCount || '-') + '\n' +
        'White label: ' + (data.whiteLabel ? 'Yes' : 'No') + '\n' +
        'Current system: ' + (data.currentSystem || '-') + '\n\n' +
        (data.message || ''),
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

### 3. Deploy it as a web app

1. **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. **Description:** `Taleem360 lead receiver`
4. **Execute as:** **Me**
5. **Who has access:** **Anyone** — required, because Vercel posts to it without a Google login
6. **Deploy** → **Authorize access** → choose your account → **Advanced** → **Go to (unsafe)** → **Allow**

   *The "unsafe" warning is normal for a personal script. It is your own code, and the only scopes it needs are Sheets and Mail.*

7. Copy the **Web app URL** — it ends in `/exec`

### 4. Set the environment variables in Vercel

1. Vercel → the Taleem360 project → **Settings → Environment Variables**
2. Add:

| Name | Value | Environments |
|---|---|---|
| `LEAD_WEBHOOK_URL` | the `/exec` URL from step 3 | Production, Preview |
| `LEAD_SHARED_SECRET` | the same random string as `SHARED_SECRET` | Production, Preview |

3. **Redeploy** — environment variables only apply to new deployments (Deployments → ⋯ → Redeploy)

### 5. Verify

Submit a test through `https://taleem360.online/pricing#quote` and confirm:

- [ ] a row appears in the **Leads** sheet
- [ ] the alert email arrives
- [ ] the visitor sees "Request received" (or lands on `/thank-you` with JavaScript disabled)

If nothing arrives, check Vercel → **Deployments → Functions → `api/leads/quote`** logs. The endpoint prints exactly why it failed.

---

## What the endpoint does with a submission

- **Requires** name, email and message for a contact; plus institution name and student count for a quote
- **Coerces** institution type to a known value; anything else becomes `Other`
- **Caps** every field length, so a hostile body cannot bloat the sheet
- **Honeypot**: a field hidden from humans. Bots fill it and the request is accepted without being delivered
- **Throttles** to 5 submissions per IP per minute (best-effort — serverless instances are ephemeral)
- **Times out** the webhook at 10 seconds
- **Logs** the reason on any failure and tells the visitor to email instead

---

## Reusing this elsewhere in the portfolio

The pattern is property-agnostic: one Apps Script per property, one `LEAD_WEBHOOK_URL` per Vercel project, and the same endpoint shape. Each property should have its **own sheet** — do not merge leads across properties, so per-site attribution stays clean.

---

## Not yet done

- **No spam protection beyond the honeypot and throttle.** If the form starts attracting junk, add a CAPTCHA or move the check to the edge.
- **No CRM.** Leads land in a sheet. That is enough until there is revenue to justify anything else — per the mandate, no paid tooling until the earning gate opens.
- **No delivery to the visitor's own inbox.** They get no confirmation email, only the on-screen message. Worth adding once a sending domain is set up.
