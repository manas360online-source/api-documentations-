import React, { useState } from 'react';
import { ApiEndpoint } from '../types';
import { CodeBlock } from './CodeBlock';
import { Play, Loader2, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { analyzeMedicalDocument } from '../services/geminiService';

interface EndpointViewerProps {
  endpoint: ApiEndpoint;
}

const methodColors = {
  GET: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  POST: 'text-green-400 bg-green-400/10 border-green-400/20',
  PUT: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  DELETE: 'text-red-400 bg-red-400/10 border-red-400/20',
  PATCH: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
};

export const EndpointViewer: React.FC<EndpointViewerProps> = ({ endpoint }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'params' | 'response' | 'try'>('params');
  const [isLoading, setIsLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testBody, setTestBody] = useState(
    endpoint.id === 'analyze-document' 
    ? 'Patient presents with severe headache persisting for 3 days. BP is 140/90. History of migraines. Denies nausea.' 
    : ''
  );

  const handleTryIt = async () => {
    setIsLoading(true);
    setTestResponse(null);

    // Simulator Logic
    try {
      await new Promise(r => setTimeout(r, 800)); // Network simulation

      if (endpoint.isAiPowered && endpoint.id === 'analyze-document') {
        const result = await analyzeMedicalDocument(testBody);
        try {
            setTestResponse(JSON.parse(result));
        } catch (e) {
            setTestResponse({ raw: result });
        }
      } else {
        // Mock responses for other endpoints
        if (endpoint.method === 'GET') {
          setTestResponse(endpoint.responses[0].schema || { message: "Mock data received" });
        } else {
          setTestResponse({ success: true, id: 'mock_created_id_123', timestamp: new Date().toISOString() });
        }
      }
    } catch (error) {
      setTestResponse({ error: "Failed to fetch response", details: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-slate-700 rounded-lg bg-slate-800/50 mb-6 overflow-hidden transition-all duration-200">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className={`px-2 py-1 rounded text-xs font-bold border ${methodColors[endpoint.method]}`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-sm text-slate-300">{endpoint.path}</span>
          <span className="text-slate-500 text-sm hidden sm:inline">- {endpoint.summary}</span>
        </div>
        {isExpanded ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-500" />}
      </div>

      {isExpanded && (
        <div className="border-t border-slate-700 bg-slate-900/50 p-4 sm:p-6">
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            {endpoint.description}
          </p>

          <div className="flex gap-6 mb-4 border-b border-slate-700">
            {(['params', 'response', 'try'] as const).map(tab => (
              <button
                key={tab}
                onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === tab 
                  ? 'text-brand-500 border-b-2 border-brand-500' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === 'params' && 'Parameters'}
                {tab === 'response' && 'Response Schema'}
                {tab === 'try' && 'Try it out'}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'params' && (
              <div className="space-y-4">
                {endpoint.parameters?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="py-2 px-2">Name</th>
                          <th className="py-2 px-2">In</th>
                          <th className="py-2 px-2">Type</th>
                          <th className="py-2 px-2">Required</th>
                          <th className="py-2 px-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.parameters.map((param, i) => (
                          <tr key={i} className="border-b border-slate-800 text-slate-300">
                            <td className="py-2 px-2 font-mono text-brand-500">{param.name}</td>
                            <td className="py-2 px-2 text-slate-500">{param.in}</td>
                            <td className="py-2 px-2 text-slate-500">{param.type}</td>
                            <td className="py-2 px-2">
                              {param.required && <span className="text-red-400 text-xs font-bold">YES</span>}
                            </td>
                            <td className="py-2 px-2 text-slate-400">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                   !endpoint.requestBody && <div className="text-slate-500 italic p-2">No parameters required.</div>
                )}

                {endpoint.requestBody && (
                  <div className="mt-4">
                     <h4 className="text-sm font-medium text-slate-300 mb-2">Request Body</h4>
                     <CodeBlock language="json" code={JSON.stringify(endpoint.requestBody, null, 2)} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'response' && (
              <div>
                <div className="flex gap-2 mb-2">
                  {endpoint.responses.map((res, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded border ${
                      res.status >= 200 && res.status < 300 
                      ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                      : 'border-red-500/30 bg-red-500/10 text-red-400'
                    }`}>
                      {res.status}
                    </span>
                  ))}
                </div>
                {endpoint.responses[0].schema ? (
                  <CodeBlock language="json" code={JSON.stringify(endpoint.responses[0].schema, null, 2)} />
                ) : (
                  <div className="text-slate-500 italic">No content returned.</div>
                )}
              </div>
            )}

            {activeTab === 'try' && (
              <div className="space-y-4">
                 <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                        <span className="font-bold text-white">Target:</span> 
                        <span className="font-mono bg-slate-900 px-2 py-1 rounded">https://api.medcore.dev{endpoint.path}</span>
                    </div>

                    {endpoint.id === 'analyze-document' && (
                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-2">Simulate Document Content</label>
                            <textarea
                                value={testBody}
                                onChange={(e) => setTestBody(e.target.value)}
                                className="w-full h-32 bg-slate-900 border border-slate-700 rounded p-3 text-sm text-slate-200 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <AlertCircle size={12}/> This sends data to Google Gemini to simulate our AI analysis pipeline.
                            </p>
                        </div>
                    )}

                    <button 
                        onClick={handleTryIt}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        Execute Request
                    </button>
                 </div>

                 {testResponse && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Response</h4>
                        <CodeBlock language="json" code={JSON.stringify(testResponse, null, 2)} />
                    </div>
                 )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
