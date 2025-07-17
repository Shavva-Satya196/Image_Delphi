"use client";

import { useState } from "react";
import { Key } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageAnalysis } from "@/components/ImageAnalysis";
import { ApiKeySettings } from "@/components/ApiKeySettings";
//import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { getApiKey } from "@/lib/googleai";

export interface AnalysisResult {
  id: string;
  imageUrl: string;
  description: string;
  fileName: string;
  timestamp: Date;
}

const Home = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const apiKeyAvailable = !!getApiKey();

  const handleImageAnalyzed = (result: AnalysisResult) => {
    setAnalysisResults((prev) => [result, ...prev]);
    toast({
      title: "Analysis Complete",
      description: "Your image was successfully processed by AI.",
    });
  };

  const handleStart = () => setIsAnalyzing(true);
  const handleEnd = () => setIsAnalyzing(false);

  const handleError = (message: string) => {
    toast({
      title: "Analysis Failed",
      description: message,
      variant: "destructive",
    });
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            AI Image Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload an image 
          </p>
        </section>

        <section className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Upload & API Settings */}
          <div className="space-y-6">
            <ApiKeySettings />

            {apiKeyAvailable && (
              <ImageUpload
                onImageAnalyzed={handleImageAnalyzed}
                onAnalysisStart={handleStart}
                onAnalysisEnd={handleEnd}
                onError={handleError}
                isAnalyzing={isAnalyzing}
              />
            )}

            {!apiKeyAvailable && analysisResults.length === 0 && !isAnalyzing && (
              <EmptyState
                icon={<Key className="w-12 h-12 text-blue-500" />}
                title="API Key Required"
                message="Please add your Google AI Studio API key"
              />
            )}

            {apiKeyAvailable && analysisResults.length === 0 && !isAnalyzing && (
              <EmptyState
                icon={
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
                title="No images analyzed yet"
                message="Upload your first image to see the AI-powered results."
              />
            )}
          </div>

          {/* Display Analysis Results */}
          <div className="space-y-6">
            {analysisResults.map((result) => (
              <ImageAnalysis key={result.id} result={result} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

const EmptyState = ({ icon, title, message }: EmptyStateProps) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default Home;
