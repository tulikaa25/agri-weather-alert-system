// logic for interacting with the Gemini API,
import axios from 'axios';
import 'dotenv/config';

// The structured output schema for Intent Detection
const intentDetectionSchema = {
    type: "object",
    properties: {
        intent: {
            type: "string",
            description: "The action the user wants to perform (get_weather, update_location, or none)."
        },
        location: {
            type: "string",
            description: "The extracted location, or an empty string if none is found."
        },
        language: {
            type: "string",
            description: "The language detected in the user's message."
        }
    },
    required: ["intent", "location", "language"]
};

// Function to call the Gemini API
export const callGeminiApi = async (systemInstruction, userInput = '', isStructured = false) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const baseUrl = process.env.GEMINI_BASE_URL;
    const endpoint = `v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const url = baseUrl + endpoint;

   
    const requestBody = {
        "contents": [],
        "generationConfig": {}
        
    };

    if (isStructured) {
        // Structured Mode: Send instructions and user input in the contents array
        requestBody.contents.push(
            {
                "role": "user",
                "parts": [
                    { "text": systemInstruction } // Full prompt (instructions and examples)
                ]
            }
        );
        requestBody.generationConfig = {
            "responseMimeType": "application/json",
            "responseSchema": intentDetectionSchema,
            "temperature": 0.0 // Deterministic output
        };
        
    } else {
    
        requestBody.contents.push(
            {
                "parts": [
                    { "text": systemInstruction }
                ]
            }
        );
        // Freeform Mode
        requestBody.generationConfig = { "temperature": 0.5 }; 
    }
    
    try {


        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
        
    } catch (e) {
        console.error("Error calling Gemini API:", e.message);
        
        if (e.response) {
            console.error("Gemini API Error Details:", e.response.data);
        }
        return null;
    }
};
