
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Copy, Download, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisResult } from '@/pages/Index';

interface ImageAnalysisProps {
  result: AnalysisResult;

}

export const ImageAnalysis = ({ result }: ImageAnalysisProps) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopyDescription = async () => {
    try {
      await navigator.clipboard.writeText(result.description);
      toast({
        title: "Copied to clipboard",
        description: "The image description has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = result.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-gray-800 truncate max-w-48">
              {result.fileName}
            </span>
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {formatTimestamp(result.timestamp)}
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsImageExpanded(!isImageExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isImageExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadImage}
              className="text-gray-500 hover:text-gray-700"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyDescription}
              className="text-gray-500 hover:text-gray-700"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Image Preview */}
        {isImageExpanded && (
          <div className="animate-fade-in">
            <img
              src={result.imageUrl}
              alt={result.fileName}
              className="w-full max-h-80 object-contain rounded-lg shadow-md bg-gray-50"
            />
          </div>
        )}

        {/* Analysis Description */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 text-lg">AI Analysis</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {result.description}
            </p>
          </div>
        </div>

        {/* Divider and Stats */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Analysis completed</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              ID: {result.id.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
