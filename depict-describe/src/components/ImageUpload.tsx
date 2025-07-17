import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyzeImage } from '@/lib/googleai';
import type { AnalysisResult } from '@/pages/Index';

interface ImageUploadProps {
  onImageAnalyzed: (result: AnalysisResult) => void;
  onAnalysisStart: () => void;
  onAnalysisEnd: () => void;
  onError: (error: string) => void;
  isAnalyzing: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUpload = ({ 
  onImageAnalyzed, 
  onAnalysisStart, 
  onAnalysisEnd, 
  onError,
  isAnalyzing 
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB.';
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    onAnalysisStart();
    
    try {
      const description = await analyzeImage(selectedFile);
      
      const result: AnalysisResult = {
        id: Date.now().toString(),
        imageUrl: previewUrl!,
        description,
        fileName: selectedFile.name,
        timestamp: new Date(),
      };

      onImageAnalyzed(result);
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      onAnalysisEnd();
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
      <div className="space-y-6">
        <div
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            ${dragActive ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300'}
            ${selectedFile ? 'border-green-400 bg-green-50/50' : ''}
            hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
              />
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">{selectedFile?.name}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Drop your image here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPEG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="flex space-x-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Analyze Image
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={isAnalyzing}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
