import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import FaviconTester from './components/FaviconTester';
import ApiDocumentation from './components/ApiDocumentation';
import './App.css';

const { FiGlobe, FiCode, FiZap } = FiIcons;

function App() {
  const [activeTab, setActiveTab] = useState('tester');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <SafeIcon icon={FiGlobe} className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Favicon Grabber</h1>
                <p className="text-sm text-slate-600">Extract favicons from any website</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Fast & Reliable</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tester')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tester'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiGlobe} className="h-4 w-4" />
                <span>Favicon Tester</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'api'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCode} className="h-4 w-4" />
                <span>API Documentation</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'tester' && <FaviconTester />}
          {activeTab === 'api' && <ApiDocumentation />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;