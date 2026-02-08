
import { GoogleGenAI } from "@google/genai";
import { MapResult } from "../types";

export const searchShopsWithAI = async (query: string, location?: { latitude: number; longitude: number }): Promise<{ text: string; maps: MapResult[] }> => {
  // Always use a named parameter and obtain API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      // Maps grounding is only supported in Gemini 2.5 series models.
      model: "gemini-2.5-flash",
      contents: `Find car part shops or automotive services in Djibouti related to: ${query}`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: location ? {
              latitude: location.latitude,
              longitude: location.longitude
            } : {
              latitude: 11.588, // Djibouti City default
              longitude: 43.145
            }
          }
        }
      },
    });

    // Extract text from response using the getter (not a method)
    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const maps: MapResult[] = groundingChunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps.title,
        uri: chunk.maps.uri,
        snippet: chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0]
      }));

    return { text, maps };
  } catch (error) {
    console.error("AI Search Error:", error);
    return { text: "Une erreur est survenue lors de la recherche.", maps: [] };
  }
};
