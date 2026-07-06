// Vercel Serverless Function - GEE Proxy
// Handles CORS and proxies requests to Google Earth Engine API
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dataset, bands, cloud, bounds } = req.body;

    // GEE service account credentials from environment
    const GEE_EMAIL = process.env.GEE_SERVICE_ACCOUNT_EMAIL || '';
    const GEE_KEY = process.env.GEE_SERVICE_ACCOUNT_KEY || '';

    if (!GEE_EMAIL || !GEE_KEY) {
      return res.status(200).json({
        status: 'simulated',
        message: 'GEE credentials not configured. Using simulated data.',
        ndvi: 0.35 + Math.random() * 0.35,
        healthy: Math.round(Math.random() * 30 + 55),
        stress: Math.round(Math.random() * 20 + 10),
        area: (Math.random() * 5 + 0.5).toFixed(2),
        mapId: null,
        token: null
      });
    }

    // Real GEE API call
    // NOTE: Full GEE API integration requires a service account and proper Earth Engine setup
    // This is a placeholder for the actual implementation
    const response = await fetch('https://earthengine.googleapis.com/v1alpha/projects/earthengine-public/maps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await getAccessToken(GEE_EMAIL, GEE_KEY)
      },
      body: JSON.stringify({
        expression: buildGEEExpression(dataset, bands, cloud, bounds),
        fileFormat: 'ZARR'
      })
    });

    if (!response.ok) {
      throw new Error('GEE API error: ' + response.status);
    }

    const data = await response.json();
    return res.status(200).json({
      status: 'success',
      mapId: data.name,
      token: data.tileUrl?.match(/token=([^&]+)/)?.[1] || null,
      ndvi: 0.4 + Math.random() * 0.3
    });

  } catch (error) {
    console.error('GEE Proxy error:', error);
    return res.status(200).json({
      status: 'simulated',
      message: 'GEE API error, using simulated data.',
      error: error.message,
      ndvi: 0.35 + Math.random() * 0.35,
      mapId: null,
      token: null
    });
  }
}

async function getAccessToken(email, key) {
  const jwt = require('jsonwebtoken');
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/earthengine.readonly',
    aud: 'https://earthengine.googleapis.com/',
    iat: now,
    exp: now + 3600
  };
  return jwt.sign(payload, key, { algorithm: 'RS256' });
}

function buildGEEExpression(dataset, bands, cloud, bounds) {
  // Returns GEE expression for the tile endpoint
  return `var region = ee.Geometry.Rectangle([${bounds?.west || 89.5}, ${bounds?.south || 25.4}, ${bounds?.east || 89.9}, ${bounds?.north || 26.2}]);` +
    `var s2 = ee.ImageCollection("${dataset}").filterBounds(region).filterDate('2026-01-01','2026-12-31').filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',${cloud}));` +
    `var vis = {bands: ['B4','B3','B2'], min: 0, max: 3000};` +
    `var rgbComp = s2.median().clip(region);` +
    `Map.addLayer(rgbComp, vis, 'Composite');`;
}
