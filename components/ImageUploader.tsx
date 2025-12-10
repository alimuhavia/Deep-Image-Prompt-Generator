import React, { useRef, useState, useCallback } from 'react';
import { ImageFile } from '../types';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (image: ImageFile) => void;
  selectedImage: ImageFile | null;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected({
          preview: reader.result as string,
          file: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      // Wait for state update before setting srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 0);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onImageSelected({ preview: dataUrl });
        stopCamera();
      }
    }
  };

  if (selectedImage) {
    return (
      <div className="relative w-full max-w-md mx-auto mb-8 animate-fade-in">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
          <img 
            src={selectedImage.preview} 
            alt="Selected" 
            className="w-full h-auto max-h-[400px] object-cover" 
          />
          <button 
            onClick={onClear}
            className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-lg"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (isCameraOpen) {
    return (
      <div className="w-full max-w-md mx-auto mb-8 bg-black rounded-2xl overflow-hidden shadow-2xl relative">
        <video 
          ref={videoRef} 
          className="w-full h-[400px] object-cover" 
          playsInline 
          muted 
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
           <button 
            onClick={stopCamera}
            className="bg-slate-800/80 text-white p-3 rounded-full hover:bg-slate-700 backdrop-blur-md"
          >
            <X size={24} />
          </button>
          <button 
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full border-4 border-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex gap-4">
        {/* Upload Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-slate-800 hover:bg-slate-750 border-2 border-dashed border-slate-600 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group h-40"
        >
          <div className="bg-slate-700 p-3 rounded-full mb-3 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
            <Upload size={28} />
          </div>
          <span className="font-medium text-slate-300 group-hover:text-white">Upload Photo</span>
          <span className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Camera Button */}
        <div 
          onClick={startCamera}
          className="flex-1 bg-slate-800 hover:bg-slate-750 border-2 border-dashed border-slate-600 hover:border-emerald-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group h-40"
        >
           <div className="bg-slate-700 p-3 rounded-full mb-3 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
            <Camera size={28} />
          </div>
          <span className="font-medium text-slate-300 group-hover:text-white">Use Camera</span>
          <span className="text-xs text-slate-500 mt-1">Capture direct</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
        <ImageIcon size={16} />
        <p>Supports drag & drop</p>
      </div>
    </div>
  );
};
