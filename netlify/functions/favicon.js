export async function handler(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=86400' // 24 hours
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { domain, size = '32', fallback = 'letter', bgColor = '#6366f1', textColor = '#ffffff', fallbackUrl } = event.queryStringParameters || {};

  if (!domain) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Domain parameter is required' })
    };
  }

  try {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Try to fetch favicon from common locations
    const faviconUrls = [
      `https://${cleanDomain}/favicon.ico`,
      `https://${cleanDomain}/favicon.png`,
      `https://${cleanDomain}/apple-touch-icon.png`,
      `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=${size}`,
      `https://favicon.yandex.net/favicon/${cleanDomain}`,
      `https://www.google.com/s2/favicons?domain=${cleanDomain}`
    ];

    let faviconBuffer = null;
    
    // Try each URL
    for (const url of faviconUrls) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 5000
        });
        
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          if (arrayBuffer.byteLength > 0) {
            faviconBuffer = new Uint8Array(arrayBuffer);
            break;
          }
        }
      } catch (error) {
        continue; // Try next URL
      }
    }

    // If no favicon found, generate letter avatar
    if (!faviconBuffer) {
      const letter = cleanDomain.charAt(0).toUpperCase();
      const sizeNum = parseInt(size);
      
      // Generate SVG
      const svg = `
        <svg width="${sizeNum}" height="${sizeNum}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${sizeNum}" height="${sizeNum}" fill="${bgColor}"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.floor(sizeNum * 0.6)}" 
                font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">
            ${letter}
          </text>
        </svg>
      `;
      
      // Convert SVG to base64
      const base64Svg = Buffer.from(svg).toString('base64');
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'image/svg+xml' },
        body: base64Svg,
        isBase64Encoded: true
      };
    }

    return {
      statusCode: 200,
      headers,
      body: Buffer.from(faviconBuffer).toString('base64'),
      isBase64Encoded: true
    };

  } catch (error) {
    console.error('Error fetching favicon:', error);
    
    // Generate fallback letter avatar
    const letter = domain.charAt(0).toUpperCase();
    const sizeNum = parseInt(size);
    
    const svg = `
      <svg width="${sizeNum}" height="${sizeNum}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${sizeNum}" height="${sizeNum}" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.floor(sizeNum * 0.6)}" 
              font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">
          ${letter}
        </text>
      </svg>
    `;
    
    const base64Svg = Buffer.from(svg).toString('base64');
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'image/svg+xml' },
      body: base64Svg,
      isBase64Encoded: true
    };
  }
}