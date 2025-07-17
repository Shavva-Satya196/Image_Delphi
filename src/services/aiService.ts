// AI Service for image analysis using Google Gemini Vision

export interface AnalysisResult {
  description: string;
  timestamp: Date;
}

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get just the base64 data
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async analyzeImage(file: File): Promise<AnalysisResult> {
    const base64Image = await this.convertImageToBase64(file);
    return this.analyzeWithGoogle(base64Image);
  }

  private async analyzeWithGoogle(base64Image: string): Promise<AnalysisResult> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Analyze this image in detail. Describe what you see, including objects, people, scenery, colors, mood, composition, and any other notable elements. Provide a comprehensive and engaging description.'
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to analyze image with Google AI');
    }

    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!description) {
      throw new Error('No description received from Google AI');
    }

    return {
      description,
      timestamp: new Date(),
    };
  }
}