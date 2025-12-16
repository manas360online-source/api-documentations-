import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Shield, 
  Activity, 
  Database, 
  Server, 
  Menu, 
  X, 
  Zap,
  Layout
} from 'lucide-react';
import { endpoints, errorCodes } from './data/apiData';
import { EndpointViewer } from './components/EndpointViewer';
import { CodeBlock } from './components/CodeBlock';

// --- Sidebar Component ---
const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { path: '/', label: 'Overview', icon: <BookOpen size={18} /> },
    { path: '/auth', label: 'Authentication', icon: <Shield size={18} /> },
    { path: '/patients', label: 'Patients API', icon: <Activity size={18} /> },
    { path: '/therapists', label: 'Therapists API', icon: <Layout size={18} /> },
    { path: '/documents', label: 'Documents & AI', icon: <Database size={18} /> },
    { path: '/errors', label: 'Errors & Limits', icon: <Server size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-bold text-lg text-white">MedCore API</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive(link.path) 
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-400 font-mono">System Status: Operational</span>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Pages ---

const OverviewPage = () => (
  <div className="max-w-4xl">
    <h1 className="text-3xl font-bold text-white mb-6">MedCore Hospital API</h1>
    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
      Welcome to the MedCore Developer Platform. Our API provides a robust interface for hospital management systems, 
      enabling seamless integration of patient records, therapist schedules, and AI-powered document analysis.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
        <Zap className="text-yellow-400 mb-4" size={32} />
        <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Analysis</h3>
        <p className="text-slate-400 text-sm">
          Leverage our Gemini-integrated Document API to automatically extract symptoms, vitals, and diagnoses from unstructured clinical notes.
        </p>
      </div>
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
        <Activity className="text-brand-400 mb-4" size={32} />
        <h3 className="text-xl font-semibold text-white mb-2">Real-time Vitals</h3>
        <p className="text-slate-400 text-sm">
          Stream patient vitals and health status updates via our high-performance endpoints designed for critical care monitoring.
        </p>
      </div>
    </div>

    <h2 className="text-2xl font-semibold text-white mb-4">Getting Started</h2>
    <p className="text-slate-400 mb-4">
      The API is organized around REST. Our API has predictable resource-oriented URLs, returns JSON-encoded responses, 
      and uses standard HTTP response codes, authentication, and verbs.
    </p>
    
    <div className="mt-6">
      <h3 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-2">Base URL</h3>
      <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-300 text-sm">
        <span>https://api.medcore.dev/v1</span>
      </div>
    </div>
  </div>
);

const AuthPage = () => (
  <div className="max-w-4xl">
    <h1 className="text-3xl font-bold text-white mb-6">Authentication</h1>
    <p className="text-slate-400 mb-6">
      The MedCore API uses API keys to authenticate requests. You can view and manage your API keys in the 
      <a href="#" className="text-brand-400 hover:underline mx-1">Developer Dashboard</a>.
    </p>

    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-8">
      <p className="text-yellow-200 text-sm">
        <strong>Warning:</strong> Your API keys carry many privileges, so be sure to keep them secure! 
        Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
      </p>
    </div>

    <h2 className="text-xl font-semibold text-white mb-4">Bearer Token</h2>
    <p className="text-slate-400 mb-4">
      Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value. 
      You do not need to provide a password.
    </p>

    <CodeBlock 
      label="BASH"
      language="bash" 
      code={`curl https://api.medcore.dev/v1/patients \\
  -H "Authorization: Bearer sk_live_123456789" \\
  -H "Content-Type: application/json"`} 
    />

    <h2 className="text-xl font-semibold text-white mb-4 mt-8">Client Libraries</h2>
    <div className="grid gap-4">
      <div>
        <h3 className="text-white font-medium mb-2">Node.js</h3>
        <CodeBlock 
          language="javascript" 
          code={`const medcore = require('medcore-node')('sk_live_...');

const patient = await medcore.patients.retrieve('pat_123');`} 
        />
      </div>
      <div>
        <h3 className="text-white font-medium mb-2">Python</h3>
        <CodeBlock 
          language="python" 
          code={`import medcore
medcore.api_key = "sk_live_..."

patient = medcore.Patient.retrieve("pat_123")`} 
        />
      </div>
    </div>
  </div>
);

const ErrorsPage = () => (
  <div className="max-w-4xl">
    <h1 className="text-3xl font-bold text-white mb-6">Errors & Rate Limits</h1>
    
    <h2 className="text-xl font-semibold text-white mb-4">Rate Limits</h2>
    <p className="text-slate-400 mb-6">
      The API is rate limited to <strong>100 requests per minute</strong> per API token. 
      If you exceed this limit, you will receive a <code className="text-red-400">429 Too Many Requests</code> response.
    </p>
    <div className="p-4 bg-slate-800 rounded-lg mb-8">
       <h4 className="text-white font-mono text-sm mb-2">Headers</h4>
       <ul className="text-sm text-slate-400 space-y-2 font-mono">
          <li><span className="text-brand-400">X-RateLimit-Limit</span>: The maximum number of requests you're permitted to make per minute.</li>
          <li><span className="text-brand-400">X-RateLimit-Remaining</span>: The number of requests remaining in the current time window.</li>
          <li><span className="text-brand-400">X-RateLimit-Reset</span>: The time at which the current rate limit window resets.</li>
       </ul>
    </div>

    <h2 className="text-xl font-semibold text-white mb-4">Error Codes</h2>
    <div className="overflow-hidden rounded-lg border border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-4">Code</th>
            <th className="p-4">Message</th>
            <th className="p-4">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 bg-slate-900">
          {errorCodes.map((err) => (
            <tr key={err.code}>
              <td className="p-4 font-mono text-brand-400">{err.code}</td>
              <td className="p-4 text-white font-medium">{err.message}</td>
              <td className="p-4 text-slate-400">{err.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const EndpointCategoryPage = ({ title, category, description }: { title: string, category: string, description: string }) => {
  const categoryEndpoints = endpoints.filter(e => e.tags.includes(category));
  
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400 mb-8">{description}</p>
      
      <div className="space-y-8">
        {categoryEndpoints.map(endpoint => (
          <EndpointViewer key={endpoint.id} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
};


// --- Main Layout ---

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#0B1120]">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden h-16 border-b border-slate-800 flex items-center px-4 bg-slate-900/50 backdrop-blur sticky top-0 z-30">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 mr-4">
              <Menu />
            </button>
            <span className="font-bold text-white">MedCore API</span>
          </header>

          <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/patients" 
                element={
                  <EndpointCategoryPage 
                    title="Patients" 
                    category="Patients" 
                    description="Manage patient records, demographics, and admission status." 
                  />
                } 
              />
              <Route 
                path="/therapists" 
                element={
                  <EndpointCategoryPage 
                    title="Therapists" 
                    category="Therapists" 
                    description="Access therapist profiles, credentials, and scheduling availability." 
                  />
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <EndpointCategoryPage 
                    title="Documents & AI" 
                    category="Documents" 
                    description="Upload medical documents and use MedCore AI to extract insights from clinical notes." 
                  />
                } 
              />
              <Route path="/errors" element={<ErrorsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
