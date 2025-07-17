import React, { useCallback, useState } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isAnalyzing: boolean;
  selectedImage: File | null;
  onClearImage: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  isAnalyzing,
  selectedImage,
  onClearImage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (selectedImage) {
    return (
      <Card className="relative overflow-hidden bg-gradient-card border-border/50 shadow-card">
        <div className="relative group">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected for analysis"
            className="w-full h-64 object-cover"
          />
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing image...</p>
              </div>
            </div>
          )}
          
          {!isAnalyzing && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onClearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>File:</strong> {selectedImage.name}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`relative border-2 border-dashed transition-all duration-300 bg-gradient-card shadow-card ${
        isDragOver
          ? 'border-primary bg-primary/5 animate-pulse-glow'
          : 'border-border hover:border-primary/50'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <div className="p-12 text-center">
        <div className="mb-6">
          {isDragOver ? (
            <Upload className="w-16 h-16 mx-auto text-primary animate-scale-in" />
          ) : (
            <Image className="w-16 h-16 mx-auto text-muted-foreground" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
        <p className="text-muted-foreground mb-6">
          Drop your image here or click to browse
        </p>
        
        <div className="space-y-2">
          <Button
            variant="default"
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </Button>
          
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP • Max 10MB
          </p>
        </div>
        
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </Card>
  );
};