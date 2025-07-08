import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCode, FiCopy, FiCheck, FiExternalLink, FiGlobe, FiLayers } = FiIcons;

const ApiDocumentation = () => {
  const [copiedExample, setCopiedExample] = useState(null);
  
  const API_BASE_URL = window.location.origin;

  const handleCopyExample = async (example, index) => {
    try {
      await navigator.clipboard.writeText(example);
      setCopiedExample(index);
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const examples = [
    {
      title: "Basic Usage",
      description: "Get a favicon with default settings",
      url: `${API_BASE_URL}/.netlify/functions/favicon?domain=google.com`
    },
    {
      title: "Custom Size",
      description: "Specify favicon size (16, 32, 48, 64, 128)",
      url: `${API_BASE_URL}/.netlify/functions/favicon?domain=github.com&size=64`
    },
    {
      title: "Letter Fallback with Custom Colors",
      description: "Use letter avatar fallback with custom background and text colors",
      url: `${API_BASE_URL}/.netlify/functions/favicon?domain=nonexistent-site.com&fallback=letter&bgColor=%23ff6b6b&textColor=%23ffffff`
    },
    {
      title: "URL Fallback",
      description: "Use a custom image as fallback",
      url: `${API_BASE_URL}/.netlify/functions/favicon?domain=nonexistent-site.com&fallback=url&fallbackUrl=https://example.com/fallback.png`
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          API Documentation
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Learn how to integrate the Favicon Grabber API into your applications 
          with comprehensive examples and parameter documentation.
        </p>
      </div>

      {/* API Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiLayers} className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Multi-Source Favicon Service</h3>
              <p className="text-sm text-blue-700">Intelligent fallbacks with multiple providers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">Ready</span>
          </div>
        </div>
      </div>

      {/* Service Sources */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Favicon Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-red-500 rounded-lg mx-auto mb-2"></div>
            <h4 className="font-medium text-slate-900">Google</h4>
            <p className="text-xs text-slate-600">Primary source</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg mx-auto mb-2"></div>
            <h4 className="font-medium text-slate-900">Yandex</h4>
            <p className="text-xs text-slate-600">Secondary source</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2"></div>
            <h4 className="font-medium text-slate-900">DuckDuckGo</h4>
            <p className="text-xs text-slate-600">Tertiary source</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg mx-auto mb-2"></div>
            <h4 className="font-medium text-slate-900">Direct</h4>
            <p className="text-xs text-slate-600">Website direct</p>
          </div>
        </div>
      </div>

      {/* Endpoint */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Endpoint</h3>
        <div className="bg-slate-900 rounded-lg p-4">
          <code className="text-green-400 font-mono">
            GET {API_BASE_URL}/.netlify/functions/favicon
          </code>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Parameters</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-900">Parameter</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Required</th>
                <th className="text-left py-3 px-4 font-medium text-slate-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-indigo-600">domain</td>
                <td className="py-3 px-4 text-sm text-slate-600">string</td>
                <td className="py-3 px-4 text-sm text-red-600">Yes</td>
                <td className="py-3 px-4 text-sm text-slate-600">The domain name to extract favicon from</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-indigo-600">size</td>
                <td className="py-3 px-4 text-sm text-slate-600">integer</td>
                <td className="py-3 px-4 text-sm text-slate-600">No</td>
                <td className="py-3 px-4 text-sm text-slate-600">Size in pixels (16, 32, 48, 64, 128). Default: 32</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-indigo-600">fallback</td>
                <td className="py-3 px-4 text-sm text-slate-600">string</td>
                <td className="py-3 px-4 text-sm text-slate-600">No</td>
                <td className="py-3 px-4 text-sm text-slate-600">Fallback type: "letter" or "url". Default: "letter"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-indigo-600">bgColor</td>
                <td className="py-3 px-4 text-sm text-slate-600">string</td>
                <td className="py-3 px-4 text-sm text-slate-600">No</td>
                <td className="py-3 px-4 text-sm text-slate-600">Background color for letter fallback (hex format). Default: "#6366f1"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-indigo-600">textColor</td>
                <td className="py-3 px-4 text-sm text-slate-600">string</td>
                <td className="py-3 px-4 text-sm text-slate-600">No</td>
                <td className="py-3 px-4 text-sm text-slate-600">Text color for letter fallback (hex format). Default: "#ffffff"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-sm text-indigo-600">fallbackUrl</td>
                <td className="py-3 px-4 text-sm text-slate-600">string</td>
                <td className="py-3 px-4 text-sm text-slate-600">No</td>
                <td className="py-3 px-4 text-sm text-slate-600">Custom fallback image URL (when fallback="url")</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Live Examples</h3>
        <div className="space-y-6">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-slate-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{example.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{example.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleCopyExample(example.url, index)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy URL"
                  >
                    {copiedExample === index ? (
                      <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
                    ) : (
                      <SafeIcon icon={FiCopy} className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={example.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Open in new tab"
                  >
                    <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <code className="text-green-400 font-mono text-sm break-all">
                  {example.url}
                </code>
              </div>
              {/* Live preview */}
              <div className="mt-3 flex items-center space-x-3">
                <span className="text-sm text-slate-600">Preview:</span>
                <img
                  src={example.url}
                  alt="Favicon preview"
                  className="w-8 h-8 border border-slate-200 rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Client-Side Usage */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Client-Side Service</h3>
        <p className="text-slate-600 mb-4">
          Use our JavaScript service for better performance and automatic fallbacks:
        </p>
        <div className="bg-slate-900 rounded-lg p-4">
          <code className="text-green-400 font-mono text-sm">
            {`import { faviconService } from './utils/faviconService';

// Get favicon with automatic fallbacks
const faviconUrl = await faviconService.getFavicon('google.com', {
  size: 32,
  fallback: 'letter',
  bgColor: '#6366f1',
  textColor: '#ffffff'
});

// Use in your component
<img src={faviconUrl} alt="Favicon" width="32" height="32" />`}
          </code>
        </div>
      </div>

      {/* Integration Examples */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Integration Examples</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">React Component</h4>
            <div className="bg-slate-900 rounded-lg p-4">
              <code className="text-green-400 font-mono text-sm">
                {`import React, { useState, useEffect } from 'react';
import { faviconService } from './utils/faviconService';

const FaviconImage = ({ domain, size = 32 }) => {
  const [src, setSrc] = useState('');
  
  useEffect(() => {
    faviconService.getFavicon(domain, { size })
      .then(setSrc);
  }, [domain, size]);
  
  return <img src={src} alt={\`\${domain} favicon\`} />;
};`}
              </code>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Vanilla JavaScript</h4>
            <div className="bg-slate-900 rounded-lg p-4">
              <code className="text-green-400 font-mono text-sm">
                {`// Multiple fallback sources
const sources = [
  'https://www.google.com/s2/favicons?domain=example.com',
  'https://favicon.yandex.net/favicon/example.com',
  'https://icons.duckduckgo.com/ip3/example.com.ico'
];

async function getFavicon(domain) {
  for (const src of sources) {
    try {
      const response = await fetch(src);
      if (response.ok) return src;
    } catch (e) { continue; }
  }
  return generateLetterAvatar(domain[0]);
}`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Best Practices</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-slate-900">Multi-Source Approach</h4>
              <p className="text-sm text-slate-600">The service tries multiple providers automatically for better reliability.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-slate-900">Intelligent Caching</h4>
              <p className="text-sm text-slate-600">Results are cached client-side to avoid repeated requests.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-slate-900">Graceful Fallbacks</h4>
              <p className="text-sm text-slate-600">Always provides a result, even if no favicon is found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;