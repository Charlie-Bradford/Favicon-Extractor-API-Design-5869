import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { faviconService } from '../utils/faviconService';

const { FiSearch, FiDownload, FiCopy, FiCheck, FiSettings, FiRefreshCw } = FiIcons;

const FaviconTester = () => {
  const [domain, setDomain] = useState('');
  const [size, setSize] = useState(32);
  const [fallback, setFallback] = useState('letter');
  const [bgColor, setBgColor] = useState('#6366f1');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!domain) return;

    setLoading(true);
    try {
      const options = {
        size,
        fallback,
        bgColor,
        textColor,
        fallbackUrl
      };

      // Get the actual favicon
      const favicon = await faviconService.getFavicon(domain, options);
      setFaviconUrl(favicon);

      // Generate API URL for documentation
      const apiUrl = faviconService.generateApiUrl(domain, options);
      setApiUrl(apiUrl);
    } catch (error) {
      console.error('Error generating favicon:', error);
      // Generate fallback on error
      const letter = domain.charAt(0);
      const fallbackIcon = faviconService.generateLetterAvatar(letter, bgColor, textColor, size);
      setFaviconUrl(fallbackIcon);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = faviconUrl;
    link.download = `favicon-${domain}-${size}x${size}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auto-generate when domain changes
  useEffect(() => {
    if (domain) {
      const timeoutId = setTimeout(handleGenerate, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [domain, size, fallback, bgColor, textColor, fallbackUrl]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Test Your Favicon URLs
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Enter a domain name and customize the fallback options to generate favicon URLs 
          with intelligent fallbacks when no favicon is available.
        </p>
      </div>

      {/* API Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              Multi-source favicon service with intelligent fallbacks
            </span>
          </div>
          <div className="text-xs text-green-600">
            Google • Yandex • DuckDuckGo • Direct
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Domain Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="google.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                />
                <SafeIcon 
                  icon={FiSearch} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Size (px)
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={16}>16x16</option>
                  <option value={32}>32x32</option>
                  <option value={48}>48x48</option>
                  <option value={64}>64x64</option>
                  <option value={128}>128x128</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fallback Type
                </label>
                <select
                  value={fallback}
                  onChange={(e) => setFallback(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="letter">Letter Avatar</option>
                  <option value="url">Custom URL</option>
                </select>
              </div>
            </div>

            {/* Advanced Options */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <SafeIcon icon={FiSettings} className="h-4 w-4" />
                <span>Advanced Options</span>
              </button>
              
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-4 border-t border-slate-200 pt-4"
                >
                  {fallback === 'letter' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Background Color
                        </label>
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                  
                  {fallback === 'url' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fallback Image URL
                      </label>
                      <input
                        type="url"
                        value={fallbackUrl}
                        onChange={(e) => setFallbackUrl(e.target.value)}
                        placeholder="https://example.com/fallback.png"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!domain || loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <SafeIcon icon={FiRefreshCw} className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSearch} className="h-4 w-4" />
                  <span>Generate Favicon</span>
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Preview</h3>
              <div className="bg-slate-50 rounded-lg p-8 border-2 border-dashed border-slate-300">
                {faviconUrl ? (
                  <div className="space-y-4">
                    <img
                      src={faviconUrl}
                      alt="Favicon preview"
                      className="mx-auto"
                      style={{ width: size, height: size }}
                      onError={(e) => {
                        // Generate fallback on error
                        const letter = domain.charAt(0);
                        const fallbackIcon = faviconService.generateLetterAvatar(letter, bgColor, textColor, size);
                        e.target.src = fallbackIcon;
                      }}
                    />
                    <p className="text-sm text-slate-600">
                      {size}x{size} pixels
                    </p>
                  </div>
                ) : (
                  <div className="text-slate-500">
                    <SafeIcon icon={FiSearch} className="h-12 w-12 mx-auto mb-2" />
                    <p>Enter a domain to preview</p>
                  </div>
                )}
              </div>
            </div>

            {apiUrl && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={apiUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-l-lg bg-slate-50 text-sm"
                    />
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-700 transition-colors"
                    >
                      {copied ? (
                        <SafeIcon icon={FiCheck} className="h-4 w-4" />
                      ) : (
                        <SafeIcon icon={FiCopy} className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiDownload} className="h-4 w-4" />
                  <span>Download Favicon</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaviconTester;