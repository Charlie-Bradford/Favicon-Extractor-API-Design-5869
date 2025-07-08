import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { load } from 'cheerio';
import { createCanvas } from 'canvas';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Cache for favicon URLs
const faviconCache = new Map();

// Helper function to extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch (error) {
    return url;
  }
}

// Helper function to generate letter avatar
function generateLetterAvatar(letter, bgColor = '#6366f1', textColor = '#ffffff', size = 32) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  
  // Draw letter
  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter.toUpperCase(), size / 2, size / 2);
  
  return canvas.toBuffer('image/png');
}

// Helper function to find favicon URLs
async function findFaviconUrls(domain) {
  const baseUrl = `https://${domain}`;
  const possibleUrls = [
    `${baseUrl}/favicon.ico`,
    `${baseUrl}/favicon.png`,
    `${baseUrl}/apple-touch-icon.png`,
    `${baseUrl}/apple-touch-icon-precomposed.png`,
    `${baseUrl}/assets/favicon.ico`,
    `${baseUrl}/static/favicon.ico`,
    `${baseUrl}/images/favicon.ico`,
  ];

  try {
    // Try to parse HTML for favicon links
    const response = await axios.get(baseUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = load(response.data);
    
    // Look for favicon links in HTML
    const faviconLinks = [];
    $('link[rel*="icon"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : new URL(href, baseUrl).href;
        faviconLinks.push(fullUrl);
      }
    });
    
    return [...faviconLinks, ...possibleUrls];
  } catch (error) {
    return possibleUrls;
  }
}

// Helper function to fetch favicon
async function fetchFavicon(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.status === 200 && response.data.length > 0) {
      return Buffer.from(response.data);
    }
  } catch (error) {
    // Silently fail for individual URLs
  }
  return null;
}

// Main favicon endpoint
app.get('/favicon', async (req, res) => {
  const { 
    domain, 
    size = 32, 
    fallback = 'letter',
    bgColor = '#6366f1',
    textColor = '#ffffff',
    fallbackUrl 
  } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain parameter is required' });
  }

  const cleanDomain = extractDomain(domain);
  const cacheKey = `${cleanDomain}_${size}`;
  
  try {
    // Check cache first
    if (faviconCache.has(cacheKey)) {
      const cachedFavicon = faviconCache.get(cacheKey);
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
      return res.send(cachedFavicon);
    }

    // Try to find and fetch favicon
    const faviconUrls = await findFaviconUrls(cleanDomain);
    let faviconBuffer = null;

    for (const url of faviconUrls) {
      faviconBuffer = await fetchFavicon(url);
      if (faviconBuffer) break;
    }

    // If no favicon found, use fallback
    if (!faviconBuffer) {
      if (fallback === 'letter') {
        const firstLetter = cleanDomain.charAt(0);
        faviconBuffer = generateLetterAvatar(firstLetter, bgColor, textColor, parseInt(size));
      } else if (fallback === 'url' && fallbackUrl) {
        faviconBuffer = await fetchFavicon(fallbackUrl);
      }
      
      // Final fallback - generate a generic icon
      if (!faviconBuffer) {
        const firstLetter = cleanDomain.charAt(0);
        faviconBuffer = generateLetterAvatar(firstLetter, bgColor, textColor, parseInt(size));
      }
    }

    // Cache the result
    faviconCache.set(cacheKey, faviconBuffer);

    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.send(faviconBuffer);

  } catch (error) {
    console.error('Error fetching favicon:', error);
    
    // Generate fallback on error
    const firstLetter = cleanDomain.charAt(0);
    const fallbackBuffer = generateLetterAvatar(firstLetter, bgColor, textColor, parseInt(size));
    
    res.set('Content-Type', 'image/png');
    res.send(fallbackBuffer);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Favicon service running on port ${PORT}`);
});