
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { zodToJsonSchema } from 'zod-to-json-schema';

const API_KEY = process.env.GOOGLE_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

const tools = {
  search: {
    name: 'search',
    description: 'search for umrah packages',
    parameters: {
      type: 'object',
      properties: {
        userPreferences: {
          type: 'object',
          properties: {
            priceRange: { type: 'string' },
            duration: { type: 'string' },
            airlinePreference: { type: 'string' },
            departureLocation: { type: 'string' },
            foodPreference: { type: 'string' },
            distanceFromHaram: { type: 'string' },
            ziyaratGuideAvailability: { type: 'boolean' },
          },
          required: []
        }
      },
      required: ['userPreferences']
    }
  }
}

export function getLlm() {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro", 
      safetySettings,
      tools: [ { functionDeclarations: [tools.search] } ]
    });
    return {
        async generateObject({ prompt, schema }) {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const call = response.functionCalls()[0];
            if (!call || !call.args) {
              return null;
            }
            return call.args.userPreferences;
        }
    }
}

export function getEmbeddings() {
    return new GoogleGenerativeAIEmbeddings({ apiKey: API_KEY });
}
