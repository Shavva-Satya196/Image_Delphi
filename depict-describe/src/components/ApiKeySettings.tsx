import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, Save, Trash2 } from 'lucide-react';
import { getApiKey, saveApiKey, removeApiKey } from '@/lib/googleai';
import { useToast } from '@/hooks/use-toast';

export const ApiKeySettings = () => {
  const [apiKey, setApiKey] = useState(getApiKey() || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(!getApiKey());
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('AIza')) {
      toast({
        title: "Invalid API Key Format",
        description: "Google API keys usually start with 'AIza'.",
        variant: "destructive",
      });
      return;
    }

    saveApiKey(apiKey);
    setIsEditing(false);
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved.",
    });
  };

  const handleRemove = () => {
    removeApiKey();
    setApiKey('');
    setIsEditing(true);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed.",
    });
  };

  const hasApiKey = !!getApiKey();

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">API Key</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                disabled={!isEditing}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            {isEditing ? (
              <Button onClick={handleSave} disabled={!apiKey.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleRemove}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
