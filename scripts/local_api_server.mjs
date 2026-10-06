// Local dev server: exposes /api/regenerate-weekly-report on port 3001
// so you can test the dashboard button without deploying to Vercel.
//
// Usage:
//   node scripts/local_api_server.mjs
//   # then visit http://localhost:3001/legacy/plantation.html and click
//   # the "⚡ রিয়েল-টাইম প্রতিবেদন তৈরি ও ইমেইল" button.
//
// Note: in the dashboard tab, the button calls /api/regenerate-weekly-report
// relative to the page origin. When you serve plantation.html from
// http://localhost:3001, the button will hit this server automatically.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.join(PROJECT_ROOT, 'plantation-tracker');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');
const SCRIPTS_DIR = path.join(PROJECT_ROOT, 'scripts');
const UPLOAD_DIR = path.join(PROJECT_ROOT, 'upload');
const OUT_DIR = path.join(REPO_ROOT, 'public', 'reports');

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

// ── Simple handler that mirrors api/regenerate-weekly-report.ts ──
// We import the Python generator via child_process spawn — same as the
// Vercel endpoint does — so behavior is identical in dev and prod.
async function handleRegenerate(req, res, body) {
  const smtpReady = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_TO);
  let wantEmail = false;
  let sourceKind = 'gas';
  let gasUrl = '';
  let liveUrl = '';
  let reportDate = '';
  try {
    if (body) {
      const b = JSON.parse(body);
      wantEmail = !!b.email;
      if (b.source) sourceKind = b.source;
      if (b.gasUrl) gasUrl = b.gasUrl;
      if (b.liveUrl) liveUrl = b.liveUrl;
      if (b.date) reportDate = b.date;
    }
  } catch { /* empty body is fine */ }
  if (req.method === 'GET' && smtpReady) wantEmail = true;
  gasUrl = gasUrl || process.env.REPORT_GAS_URL || process.env.GAS_WEBHOOK_URL || '';

  const args = ['scripts/generate_weekly_report.py', '--out-dir', OUT_DIR];
  if (sourceKind === 'live-url' && liveUrl) {
    args.push('--live-url', liveUrl);
  } else if (sourceKind === 'upload') {
    args.push('--upload-dir', UPLOAD_DIR);
  } else {
    if (!gasUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'No real-time data source. Set GAS_WEBHOOK_URL env var or pass gasUrl in the body.' }));
      return;
    }
    args.push('--gas-url', gasUrl);
  }
  if (reportDate) args.push('--date', reportDate);
  if (wantEmail) {
    if (!smtpReady) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Email requested but SMTP_* env vars are incomplete.' }));
      return;
    }
    args.push('--email');
  }

  console.log(`[regenerate] python3 ${args.join(' ')}`);
  const t0 = Date.now();
  const { spawn } = await import('node:child_process');
  const logs = [];
  await new Promise((resolve) => {
    const child = spawn('python3', args, { cwd: PROJECT_ROOT, env: { ...process.env, PYTHONUNBUFFERED: '1' } });
    child.stdout.on('data', (d) => logs.push(...d.toString().split('\n').filter(Boolean)));
    child.stderr.on('data', (d) => logs.push(...d.toString().split('\n').filter(Boolean)));
    child.on('close', resolve);
    child.on('error', resolve);
  });
  const elapsedMs = Date.now() - t0;

  const snapshotPath = path.join(OUT_DIR, 'weekly-report-snapshot.json');
  if (!fs.existsSync(snapshotPath)) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Snapshot not written', logs: logs.slice(-30) }));
    return;
  }
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    ok: true,
    generatedAt: snapshot.generatedAt,
    reportDate: snapshot.reportDate,
    sourceKind: snapshot.sourceKind,
    sourceLabel: snapshot.sourceLabel,
    elapsedMs,
    emailed: wantEmail && smtpReady,
    outDir: OUT_DIR,
    snapshot,
    logs: logs.slice(-30),
  }));
}

// ── Static file server ──
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/legacy/plantation.html';
  // Map /plantation.html and /legacy-nursery.html to /legacy/plantation.html
  if (urlPath === '/plantation.html' || urlPath === '/legacy-nursery.html') {
    urlPath = '/legacy/plantation.html';
  }
  const filePath = path.join(PUBLIC_DIR, urlPath);
  // Path traversal check
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found: ' + urlPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

// ── Main server ──
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }
  if (req.url.startsWith('/api/regenerate-weekly-report')) {
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('end', async () => {
      try {
        await handleRegenerate(req, res, body);
      } catch (e) {
        console.error('[regenerate] error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e?.message || String(e) }));
      }
    });
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`\n🌱 Local dev server running:`);
  console.log(`   http://${HOST}:${PORT}/legacy/plantation.html`);
  console.log(`   http://${HOST}:${PORT}/reports/weekly-report-snapshot.json`);
  console.log(`   http://${HOST}:${PORT}/api/regenerate-weekly-report (POST or GET)`);
  console.log(`\n📁 Serving files from: ${PUBLIC_DIR}`);
  console.log(`📊 Reports output:    ${OUT_DIR}`);
  console.log(`📥 Upload dir:         ${UPLOAD_DIR}`);
  console.log(`\n💡 To test the dashboard button:`);
  console.log(`   1. Open the URL above`);
  console.log(`   2. Click the "ড্যাশবোর্ড" tab`);
  console.log(`   3. Click the "⚡ রিয়েল-টাইম প্রতিবেদন তৈরি ও ইমেইল" button`);
  console.log(`\n💡 To enable real email sending, set SMTP_* env vars before starting:`);
  console.log(`   SMTP_HOST=smtp.gmail.com SMTP_PORT=587 \\`);
  console.log(`   SMTP_USER=you@gmail.com SMTP_PASS=your-app-pass \\`);
  console.log(`   SMTP_FROM=you@gmail.com \\`);
  console.log(`   SMTP_TO=dd-kurigram@dae.gov.bd \\`);
  console.log(`   node scripts/local_api_server.mjs`);
  console.log(`\n💡 To use real-time GAS data (instead of upload/): set GAS_WEBHOOK_URL`);
  console.log(`   GAS_WEBHOOK_URL=https://script.google.com/macros/s/your-endpoint/exec \\`);
  console.log(`   node scripts/local_api_server.mjs\n`);
});
