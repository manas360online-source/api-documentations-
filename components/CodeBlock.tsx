import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  label?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900 my-4 shadow-sm group">
      {(label || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs font-mono text-slate-400 uppercase">{label || language}</span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto custom-scrollbar relative">
         {!label && !language && (
            <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
         )}
        <pre className="font-mono text-sm leading-relaxed text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
