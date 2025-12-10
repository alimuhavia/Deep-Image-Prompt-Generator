import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface ScriptOutputProps {
  script: string;
  onReset: () => void;
}

export const ScriptOutput: React.FC<ScriptOutputProps> = ({ script, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-semibold text-slate-200">Generated Script</h3>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
              title="Generate New"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                copied 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-0 relative">
          <textarea 
            readOnly 
            value={script} 
            className="w-full h-96 bg-slate-900/30 text-slate-300 p-6 font-mono text-sm resize-y outline-none border-0 leading-relaxed"
          />
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-700 text-xs text-slate-500 flex justify-between">
            <span>Model: Gemini 2.5 Flash</span>
            <span>AI Studio</span>
        </div>
      </div>
    </div>
  );
};
