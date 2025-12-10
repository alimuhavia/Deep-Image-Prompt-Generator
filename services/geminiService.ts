import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a Deep Image Script Generator.

Your job is to analyze any photo the user uploads or captures. After analyzing the image, create a complete, detailed prompt that can recreate the picture as close as possible.

Write the script in a clear and structured way.

Your generated script must include:

1. Subject description
2. Face details (eyes, beard, hair, skin tone, expression)
3. Clothing details
4. Background and environment
5. Lighting + color tones
6. Text written in the image (names, titles, banners)
7. Objects in the image
8. Style (realistic, portrait, cartoon, 3D, etc.)
9. Camera details (angle, lens type, depth of field)
10. Extra artistic notes to match the exact mood

Rules:
- Do NOT mention “in this image” or “uploaded picture.”
- Describe everything as if you are creating it fresh.
- Keep the script long, deep, and accurate.
- Always produce a final copy-paste prompt.
- Format the output exactly as requested in the template below.

OUTPUT FORMAT:
Here is your complete image-generation script:

-------------------------------------
IMAGE SCRIPT:

[Auto-generated deep prompt goes here]
-------------------------------------

Copy the script above and use it in any AI image generator.
`;

export const generateImageScript = async (base64Image: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean base64 string to remove data URL prefix if present
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from string
              data: cleanBase64
            }
          },
          {
            text: "Analyze this image and generate the deep prompt script."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more accurate/factual description
      }
    });

    if (!response.text) {
      throw new Error("No text returned from API");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
