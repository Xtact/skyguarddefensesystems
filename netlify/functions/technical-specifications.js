const crypto = require('crypto');

const COOKIE_NAME = 'otis_tech_specs_session';
const MAX_AGE_SECONDS = 8 * 60 * 60;

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, item) => {
    const index = item.indexOf('=');
    if (index > -1) cookies[item.slice(0, index).trim()] = item.slice(index + 1).trim();
    return cookies;
  }, {});
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function makeSession(secret) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS })).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

function hasValidSession(cookieValue, secret) {
  if (!cookieValue || !secret) return false;
  const [payload, signature] = cookieValue.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload, secret);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).exp > Math.floor(Date.now() / 1000); }
  catch { return false; }
}

function page(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | SkyGuard Labs</title><style>body{margin:0;background:#07110d;color:#e8f0eb;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6}.wrap{max-width:940px;margin:0 auto;padding:48px 24px 72px}.eyebrow{color:#60d99a;font-size:.78rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase}.card{margin-top:24px;padding:30px;border:1px solid #2b5040;border-radius:14px;background:#0c1b14;box-shadow:0 16px 48px #0005}h1{font-size:clamp(1.8rem,6vw,3.2rem);line-height:1.1;margin:.5rem 0 1rem}h2{margin-top:2rem;color:#fff}p,li{color:#c6d2ca}ul{padding-left:1.25rem}.notice{border-left:3px solid #60d99a;padding:12px 16px;background:#10271c;color:#dff7e8}.muted{color:#9bac9f;font-size:.92rem}label{display:block;font-weight:700;margin:18px 0 8px}input{width:100%;box-sizing:border-box;border:1px solid #527460;border-radius:8px;background:#07110d;color:#fff;padding:13px;font:inherit}button,.button{display:inline-block;margin-top:18px;border:0;border-radius:8px;background:#60d99a;color:#062211;padding:12px 18px;font-weight:800;font:inherit;text-decoration:none;cursor:pointer}.error{color:#ffb4ad;background:#351512;border:1px solid #8b3029;border-radius:8px;padding:10px 12px}.footer{margin-top:34px;color:#9bac9f;font-size:.84rem}</style></head><body><main class="wrap">${body}</main></body></html>`;
}

function loginPage(error = '') {
  return page('Technical Specifications Access', `<div class="eyebrow">SkyGuard Labs, LLC — OTIS</div><section class="card"><h1>Technical Specifications</h1><p>Access-controlled multi-modal OTIS architecture overview.</p>${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}<form method="post" action="/.netlify/functions/technical-specifications"><label for="password">Access password</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus><button type="submit">Access specifications</button></form><p class="footer">This page is restricted. Do not enter confidential customer, government, or proprietary credentials here.</p></section>`);
}

function specificationsPage() {
  return page('Technical Specifications', `<div class="eyebrow">SkyGuard Labs, LLC — OTIS</div><section class="card"><div class="notice">Access-controlled technical architecture overview. Distribution does not authorize disclosure of proprietary calibration methodology, protected source code, private APIs, unpublished empirical data, or partner-sensitive materials.</div><h1>Detailed Architecture</h1><h2>OTIS Architecture Statement</h2><p><strong>OTIS is the sensor-agnostic geometry intelligence layer that ingests available optical and sensor-derived data, evaluates each observation, track, and fused evidence state for physical and kinematic consistency against its Threat Model Catalog™, and determines whether that evidence has earned the right to influence a safety-critical operational picture.</strong></p><h2>Optical Data Sources</h2><ul><li>Visible-spectrum RGB and monochrome camera imagery</li><li>EO imagery</li><li>IR imagery, including near-, short-wave-, mid-wave-, and long-wave IR where available</li><li>Multi-camera and stereo-camera imagery</li><li>Event-camera outputs</li><li>Hyperspectral and multispectral imagery</li><li>Structured-light optical measurements</li><li>Optical tracking, detection, imagery, contour, and video streams</li><li>Optical sensor outputs from fixed, mobile, airborne, maritime, spaceborne, robotic, autonomous, or distributed mesh-sensing platforms</li></ul><h2>Sensor Modalities and Measurements</h2><ul><li>Stereo disparity and physically derived three-dimensional depth</li><li>LiDAR point clouds, range measurements, intensity returns, and derived geometry</li><li>Time-of-flight sensor depth and range data</li><li>Structured-light depth data</li><li>Radar detections, range, range-rate, Doppler, bearing, track, and radar-derived geometry data</li><li>Acoustic and sonar ranging, bearing, and track data</li><li>Passive RF, ESM, direction-finding, and line-of-bearing measurements when present</li><li>IMU data, including acceleration, angular rate, orientation, and platform-motion state</li><li>Platform pose, attitude, velocity, altitude, heading, and local coordinate-frame data</li><li>Navigation and position sources, including GPS/GNSS, inertial navigation, visual odometry, SLAM, GPS-denied mapping/localization, and alternative position estimates</li><li>Telemetry, track history, timestamps, sensor-health information, calibration metadata, and data-provenance records</li><li>Multi-sensor fusion outputs, correlated tracks, confidence/quality measures, and C2-provided contextual data</li></ul><h2>Evidence Evaluation</h2><p>No modality receives automatic authority merely because it is present, high confidence, fused, classified, or supplied by an external system. OTIS evaluates the available evidence for geometric sufficiency, volumetric continuity, kinematic plausibility, track consistency, temporal integrity, sensor provenance, and agreement with physically grounded constraints.</p><p>Where the evidence satisfies those conditions, OTIS may permit the validated observation or track to contribute to the operational picture. Where the available sensor evidence is inadequate—such as missing depth, corrupted timing, unresolved track association, degraded geometry, conflicting localization, or insufficient observation history—OTIS returns an explicit insufficient-evidence or no-cue state rather than manufacturing certainty.</p><h2>Core Principle</h2><p><strong>OTIS ingests what the sensing stack can provide; it does not assume that any sensor, optical stream, fused track, GPS coordinate, or classified object has earned the right to affect a consequential decision until its physical consistency has been established.</strong></p><p><a class="button" href="/.netlify/functions/technical-specifications?logout=1">Log out</a></p></section>`);
}

exports.handler = async (event) => {
  const secret = process.env.TECHNICAL_SPECS_SESSION_SECRET;
  const password = process.env.TECHNICAL_SPECS_PASSWORD;
  const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
  if (!secret || !password) return { statusCode: 503, headers, body: page('Configuration Required', '<section class="card"><h1>Configuration required</h1><p>The protected Technical Specifications route is not configured yet.</p></section>') };
  if (event.queryStringParameters && event.queryStringParameters.logout === '1') {
    headers['Set-Cookie'] = `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
    headers.Location = '/.netlify/functions/technical-specifications';
    return { statusCode: 302, headers, body: '' };
  }
  if (hasValidSession(parseCookies(event.headers.cookie || '')[COOKIE_NAME], secret)) return { statusCode: 200, headers, body: specificationsPage() };
  if (event.httpMethod !== 'POST') return { statusCode: 200, headers, body: loginPage() };
  const form = new URLSearchParams(event.body || '');
  const submitted = form.get('password') || '';
  const a = Buffer.from(submitted);
  const b = Buffer.from(password);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { statusCode: 401, headers, body: loginPage('Incorrect access password.') };
  headers['Set-Cookie'] = `${COOKIE_NAME}=${makeSession(secret)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
  headers.Location = '/.netlify/functions/technical-specifications';
  return { statusCode: 302, headers, body: '' };
};
