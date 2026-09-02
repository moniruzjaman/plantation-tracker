// Vercel Serverless Function — dynamic weekly-report download proxy
//
// Why this exists:
//   Google Apps Script's doGet() can only return ContentService text
//   output -- it cannot set a Content-Disposition header or return a raw
//   binary body, so it has no way to make a browser actually download a
//   file. This proxy calls GAS's ?downloadReport=xlsx|html endpoint
//   (gas/AppsScript.gs: getWeeklyReportDownload_), which returns the
//   freshly-generated report as base64 JSON, and turns that into a real
//   file response here on a normal Node server that *can* set those
//   headers.
//
//   The result: the Dashboard's report-card buttons hit this route
//   directly and always get whatever is live in the sheet right now --
//   there is no static .xlsx/.html file committed to the repo to go
//   stale, and no manual "download the emailed attachment and commit it"
//   step required after each weekly send.
//
// Env vars (same as api/gas-sync.js):
//   GAS_WEBHOOK_URL — your /exec URL from Apps Script Deploy > Web app

export const config = { runtime: 'nodejs', maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const GAS_URL = process.env.GAS_WEBHOOK_URL;
  if (!GAS_URL) {
    return res.status(500).json({ ok: false, error: 'GAS_WEBHOOK_URL not set on server' });
  }

  const format = (req.query.format || '').toString();
  const upazila = (req.query.upazila || '').toString();
  if (format !== 'xlsx' && format !== 'html') {
    return res.status(400).json({ ok: false, error: 'format must be "xlsx" or "html"' });
  }

  try {
    const params = new URLSearchParams();
    params.set('downloadReport', format);
    if (upazila) params.set('upazila', upazila);

    const r = await fetch(GAS_URL + '?' + params.toString());
    const data = await r.json();

    if (!data || !data.ok) {
      return res.status(502).json({ ok: false, error: (data && data.error) || 'GAS report generation failed' });
    }

    // RFC 5987 encoding for the filename -- these contain Bengali
    // characters, which plain filename="..." can mangle in some browsers.
    const encodedName = encodeURIComponent(data.fileName || ('weekly-report.' + format));

    if (format === 'xlsx') {
      const buffer = Buffer.from(data.base64, 'base64');
      res.setHeader('Content-Type', data.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', "attachment; filename*=UTF-8''" + encodedName);
      // Always regenerate live -- never let a browser or CDN cache a
      // one-time-current xlsx as if it were still fresh next week.
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(buffer);
    }

    // html: open inline (matches the existing "📧 ইমেইল প্রিভিউ" link
    // opening in a new tab) rather than forcing a file download.
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', "inline; filename*=UTF-8''" + encodedName);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(data.html || '');
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
