
// Google AI Studio API integration for image analysis
export const analyzeImage = async (file: File, apiKey?: string): Promise<string> => {
  // Get API key from parameter or localStorage
  const googleApiKey = apiKey || localStorage.getItem('google-ai-api-key');
  
  if (!googleApiKey) {
    throw new Error('Google AI Studio API key is required. Please add your API key in the settings.');
  }

  try {
    // Convert file to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Please analyze this image and provide a detailed description of what you see, including objects, people, settings, colors, composition, and any notable features.',
              },
              {
                inline_data: {
                  mime_type: file.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.4,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Google AI Studio API error: ${response.status} ${response.statusText}${errorData?.error?.message ? ` - ${errorData.error.message}` : ''}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to analyze image. Please check your API key and try again.');
  }
};

// Utility functions for API key management
export const saveApiKey = (apiKey: string) => {
  localStorage.setItem('google-ai-api-key', apiKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem('google-ai-api-key');
};

export const removeApiKey = () => {
  localStorage.removeItem('google-ai-api-key');
};
