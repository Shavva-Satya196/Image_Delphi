import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Sparkles, Clock } from 'lucide-react';

interface AnalysisResultsProps {
  image: File;
  description: string;
  timestamp: Date;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  image,
  description,
  timestamp,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      {/* Image Display */}
      <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-card">
        <div className="aspect-square relative group">
          <img
            src={URL.createObjectURL(image)}
            alt="Analyzed image"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Original Image</span>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {image.name}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {(image.size / 1024 / 1024).toFixed(2)} MB
            </Badge>
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Analysis</h3>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              Analyzed on {timestamp.toLocaleDateString()} at {timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};