import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { AIService, AnalysisResult } from '@/services/aiService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles, Upload } from 'lucide-react';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  const handleApiKeySet = (key: string) => {
    if (!key) {
      setApiKey('');
      localStorage.removeItem('ai_api_key');
      return;
    }
    
    setApiKey(key);
    localStorage.setItem('ai_api_key', key);
    
    toast({
      title: "API Key Set",
      description: "Ready to analyze images with Google AI Studio",
    });
  };

  // Load saved API key on component mount
  React.useEffect(() => {
    const savedKey = localStorage.getItem('ai_api_key');
    
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage || !apiKey) return;

    setIsAnalyzing(true);
    try {
      const aiService = new AIService(apiKey);
      const result = await aiService.analyzeImage(selectedImage);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: "Your image has been successfully analyzed!",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasApiKey = !!apiKey;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Image Analysis AI</h1>
              <p className="text-muted-foreground"></p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* API Key Configuration */}
          <div className="animate-fade-in">
            <ApiKeyInput onApiKeySet={handleApiKeySet} hasApiKey={hasApiKey} />
          </div>

          {/* Upload Section */}
          {hasApiKey && (
            <div className="animate-fade-in">
              <ImageUpload
                onImageSelect={handleImageSelect}
                isAnalyzing={isAnalyzing}
                selectedImage={selectedImage}
                onClearImage={handleClearImage}
              />
            </div>
          )}

          {/* Analyze Button */}
          {selectedImage && hasApiKey && !analysisResult && (
            <div className="text-center animate-fade-in">
              <Button
                onClick={handleAnalyzeImage}
                disabled={isAnalyzing}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity px-8"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Image
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Results */}
          {analysisResult && selectedImage && (
            <div className="animate-fade-in">
              <AnalysisResults
                image={selectedImage}
                description={analysisResult.description}
                timestamp={analysisResult.timestamp}
              />
            </div>
          )}

          {/* Getting Started */}
          {!hasApiKey && (
            <Card className="bg-gradient-card border-border/50 shadow-card animate-fade-in">
              <div className="p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Get Started</h3>
                <p className="text-muted-foreground mb-4">
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="space-y-1">
                    <p className="font-medium">Supported Formats</p>
                    <p>JPEG, PNG, WebP</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Max File Size</p>
                    <p>10MB</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;