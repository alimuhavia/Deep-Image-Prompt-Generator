import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ScriptOutput } from './components/ScriptOutput';
import { generateImageScript } from './services/geminiService';
import { AppState, ImageFile } from './types';
import { Sparkles, Aperture, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = (image: ImageFile) => {
    setSelectedImage(image);
    setErrorMessage(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAppState(AppState.IDLE);
    setErrorMessage(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setAppState(AppState.ANALYZING);
    setErrorMessage(null);

    try {
      const script = await generateImageScript(selectedImage.preview);
      setGeneratedScript(script);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error("Generation failed:", error);
      setErrorMessage("Failed to analyze the image. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setGeneratedScript("");
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 bg-blue-500/10 rounded-2xl ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Aperture className="w-8 h-8 text-blue-400 mr-3" />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Deep Image Prompt
          </h1>
        </div>
        <p className="text-slate-400 max-w-lg mx-auto text-base leading-relaxed">
          Transform any photo into a highly detailed AI prompt. 
          Upload an image, and our AI will write the script to recreate it.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-12 w-full max-w-4xl mx-auto">
        
        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 max-w-md mx-auto">
            <AlertCircle size={20} />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Idle/Analyzing State - Image Input */}
        {appState !== AppState.SUCCESS && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <ImageUploader 
              onImageSelected={handleImageSelected} 
              selectedImage={selectedImage}
              onClear={handleClearImage}
            />

            {/* Generate Button */}
            {selectedImage && appState !== AppState.ANALYZING && (
              <button
                onClick={handleGenerate}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-lg font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-blue-500/25 active:scale-95"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Generate Deep Script
              </button>
            )}

            {/* Loading Indicator */}
            {appState === AppState.ANALYZING && (
              <div className="flex flex-col items-center mt-4">
                 <div className="relative">
                   <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                   </div>
                 </div>
                 <p className="mt-4 text-slate-400 font-medium animate-pulse">Analyzing visual details...</p>
                 <p className="text-xs text-slate-600 mt-1">This may take a few seconds</p>
              </div>
            )}
          </div>
        )}

        {/* Success State - Result */}
        {appState === AppState.SUCCESS && (
          <ScriptOutput 
            script={generatedScript} 
            onReset={handleReset} 
          />
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-600 text-sm border-t border-slate-800/50">
        <p>Powered by Google Gemini 2.5 Flash</p>
      </footer>

      {/* Global CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
