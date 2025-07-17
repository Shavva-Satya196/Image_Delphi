import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  onApiKeySet,
  hasApiKey,
}) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  if (hasApiKey) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">API Key Configured</p>
              <p className="text-sm text-muted-foreground">
                Using Google AI Studio (Gemini Vision)
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onApiKeySet('')}
          >
            Change
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-key">Google AI Studio API Key</Label>
            <Input
              id="google-key"
              type="password"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90"
            disabled={!apiKey.trim()}
          >
            Set API Key
          </Button>
        </form>
      </div>
    </Card>
  );
};
