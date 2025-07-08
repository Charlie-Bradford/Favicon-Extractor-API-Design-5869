// Client-side favicon service with multiple fallback options
export class FaviconService {
  constructor() {
    this.cache = new Map();
    this.API_BASE_URL = window.location.origin;
  }

  // Extract domain from URL
  extractDomain(url) {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  }

  // Generate letter avatar as data URL
  generateLetterAvatar(letter, bgColor = '#6366f1', textColor = '#ffffff', size = 32) {
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.floor(size * 0.6)}" 
              font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">
          ${letter.toUpperCase()}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Get favicon with multiple fallback strategies
  async getFavicon(domain, options = {}) {
    const {
      size = 32,
      fallback = 'letter',
      bgColor = '#6366f1',
      textColor = '#ffffff',
      fallbackUrl
    } = options;

    const cleanDomain = this.extractDomain(domain);
    const cacheKey = `${cleanDomain}_${size}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Try multiple favicon sources
    const faviconSources = [
      // Try our Netlify function first
      `${this.API_BASE_URL}/.netlify/functions/favicon?domain=${cleanDomain}&size=${size}`,
      // Google's favicon service
      `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=${size}`,
      // Yandex favicon service
      `https://favicon.yandex.net/favicon/${cleanDomain}`,
      // Direct favicon URLs
      `https://${cleanDomain}/favicon.ico`,
      `https://${cleanDomain}/favicon.png`,
      `https://${cleanDomain}/apple-touch-icon.png`,
      // DuckDuckGo favicon service
      `https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`
    ];

    // Try each source
    for (const source of faviconSources) {
      try {
        const response = await fetch(source, {
          mode: 'cors',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            this.cache.set(cacheKey, url);
            return url;
          }
        }
      } catch (error) {
        continue; // Try next source
      }
    }

    // Generate fallback
    let fallbackIcon;
    if (fallback === 'letter') {
      const firstLetter = cleanDomain.charAt(0);
      fallbackIcon = this.generateLetterAvatar(firstLetter, bgColor, textColor, size);
    } else if (fallback === 'url' && fallbackUrl) {
      fallbackIcon = fallbackUrl;
    } else {
      // Default letter fallback
      const firstLetter = cleanDomain.charAt(0);
      fallbackIcon = this.generateLetterAvatar(firstLetter, bgColor, textColor, size);
    }

    this.cache.set(cacheKey, fallbackIcon);
    return fallbackIcon;
  }

  // Generate API URL for documentation
  generateApiUrl(domain, options = {}) {
    const {
      size = 32,
      fallback = 'letter',
      bgColor = '#6366f1',
      textColor = '#ffffff',
      fallbackUrl
    } = options;

    const params = new URLSearchParams({
      domain,
      size: size.toString(),
      fallback,
      bgColor,
      textColor,
    });

    if (fallback === 'url' && fallbackUrl) {
      params.append('fallbackUrl', fallbackUrl);
    }

    return `${this.API_BASE_URL}/.netlify/functions/favicon?${params.toString()}`;
  }
}

// Export singleton instance
export const faviconService = new FaviconService();