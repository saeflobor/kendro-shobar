# Google Sheets Integration Setup Guide

This guide will help you connect this form to Google Sheets so that form submissions are automatically saved.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Kendro Volunteer Registrations"
4. In the first row, add these column headers:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Area`
   - D1: `Start Time`
   - E1: `End Time`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
// Optional write protection — set to a non-empty string to enable.
// Must match the GOOGLE_SHEETS_WRITE_KEY env var in your deployment.
var WRITE_KEY = '';

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    var count = Math.max(0, lastRow - 1);

    return ContentService
      .createTextOutput(JSON.stringify({ count: count }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ count: 0, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Optional shared-secret check
    if (WRITE_KEY && data.writeKey !== WRITE_KEY) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      data.timestamp,
      data.name,
      data.area,
      data.startTime,
      data.endTime
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (disk icon)
5. Name your project (e.g., "Form Submission Handler")

> **Important:** After updating the Apps Script code from a previous version, you must create a **new deployment** (not just save). Go to **Deploy → New deployment** and follow Step 3 again. The URL will change.

## Step 3: Deploy the Apps Script

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: Form submission endpoint
   - **Execute as**: Me
   - **Who has access**: Anyone (public endpoint)
5. Click **Deploy**
6. **Important**: Copy the **Web app URL** that appears (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)
7. Click **Done**

## Step 4: Add the URL to Your Project

Create a `.env.local` file in your project root (or set these in your hosting dashboard):

```env
GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

If you set `WRITE_KEY` to a value in the Apps Script above, also add:

```env
GOOGLE_SHEETS_WRITE_KEY=your_shared_secret
```

> See `.env.example` for a template.

## Step 5: Test the Form

1. Fill out the form on your website
2. Click submit
3. Check your Google Sheet — you should see a new row with the submitted data!

## Troubleshooting

**Form not submitting:**
- Make sure you've set the environment variable correctly
- Check that the Apps Script is deployed with "Anyone" access
- Check the browser console for error messages

**Data not appearing in sheet:**
- Verify the column headers match exactly
- Check the Apps Script execution logs: Apps Script → Executions
- Make sure you deployed the script as "Web app" not "API Executable"

**CORS errors:**
- Make sure the deployment is set to "Anyone" access
- The Apps Script automatically handles CORS

## Security Recommendations

Since the Google Apps Script endpoint is public by default, consider adding one or more of the following for production:

| Protection | Where | Notes |
|---|---|---|
| **Shared write key** | Apps Script + `.env.local` | Already supported — set `WRITE_KEY` above |
| **Rate limiting** | Hosting edge (Vercel WAF, Cloudflare) | Prevents spam/abuse at the network level |
| **CAPTCHA** | Next.js API route | e.g., hCaptcha or Cloudflare Turnstile |
| **Input validation** | Apps Script `doPost` | Reject obviously invalid data server-side |
