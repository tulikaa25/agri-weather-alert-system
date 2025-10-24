// backend/server/controllers/webhookController.js
import { IntentAndLocationPrompt, WeatherSummaryPrompt } from '../utils/promptBuilder.js';
import { callGeminiApi } from '../services/aiService.js';
import { getWeatherData } from '../services/weatherService.js'; 
import { sendMessage } from '../services/messagingService.js'; 
import User from '../models/userModel.js'; 
import { fallbackMessage } from '../enums/fallbackMessage.js'; 

export const webhookController = async (req, res) => {
    const phoneNumber = req.body.From;
    const messageBody = req.body.Body;
    let responseText = '';
    let user;
    let language = 'english';

//     console.log('Webhook received.'); 
//     console.log(`[DEBUG 1] User Message: ${messageBody}`);

    try {
        user = await User.findOne({ phoneNumber });
        
        // Call 1: Intent Detection (Using Structured Output mode: true)
        const prompt = IntentAndLocationPrompt(messageBody);
        const geminiResponse = await callGeminiApi(prompt, true); // TRUE for structured JSON
        
        if (!geminiResponse) {
            throw new Error("Gemini API call failed or returned null.");
        }

        const geminiResponseText = geminiResponse.candidates[0].content.parts[0].text;
        
        // --- Safely parse the LLM's text, stripping Markdown fences as a safety net ---
        let cleanedResponseText = geminiResponseText
            .replace(/```json\s*/g, '')
            .replace(/```\s*$/g, '')
            .trim(); 
        
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanedResponseText);
        } catch (e) {
//             console.error(`[DEBUG 2] JSON Parsing Failed: ${e.message}. Raw Text: ${cleanedResponseText.substring(0, 50)}...`);
            // If parsing fails, set parsedResponse to a default safe object to avoid further errors.
            parsedResponse = { intent: 'none', location: '', language: language };
        }
        // -----------------------------------------------------------------
        
        const { intent, location, language: parsedLanguage } = parsedResponse;
        language = parsedLanguage || language; // Prioritize AI-detected language

        // --- Initialize user and language consistently, but NO location update ---
        if (!user) {
            // New user: Initialize location to an empty string. It will only be updated if intent is 'update_location'.
            user = new User({ phoneNumber, language: language, location: '' }); 
        } else {
            // Existing user: Always update language based on the current message
            user.language = language;
        }
        
//         console.log(`[DEBUG 3] Final Parsed Intent: ${intent} | Location: ${location}`);

        switch (intent) {
            case 'get_weather':
                // Location from message OR user's saved location
                const weatherLocation = location || user.location;
                
                if (weatherLocation) {
                    const weatherData = await getWeatherData(weatherLocation);
                    if (weatherData) {
                        const summaryPrompt = WeatherSummaryPrompt(weatherData, weatherLocation, language);
                        const weatherSummary = await callGeminiApi(summaryPrompt, false); 
                        
                        if (weatherSummary && weatherSummary.candidates && weatherSummary.candidates.length > 0) {
                            responseText = weatherSummary.candidates[0].content.parts[0].text;
                        } else {
                            responseText = fallbackMessage.getMessage(fallbackMessage.WEATHER_INFO_UNAVAILABLE, language);
                        }
                    } else {
                        responseText = fallbackMessage.getMessage(fallbackMessage.WEATHER_INFO_UNAVAILABLE, language);
                    }
                } else {
                    // User asked for weather but has no saved location AND didn't provide one
                    responseText = fallbackMessage.getMessage(fallbackMessage.UNKNOWN_REQUEST, language);
                }
                break;

            case 'update_location':
                if (location) {
                   
                    user.location = location;
                    responseText = fallbackMessage.getMessage('LOCATION_UPDATE_SUCCESS', language).replace('%s', location);
                } else {
                    responseText = fallbackMessage.getMessage(fallbackMessage.UNKNOWN_REQUEST, language);
                }
                break;

            case 'none':
            default:
                responseText = fallbackMessage.getMessage(fallbackMessage.UNKNOWN_REQUEST, language);
                break;
        }

//         console.log(`[DEBUG 4] User object before save: ${JSON.stringify(user)}`);
        await user.save();

    } catch (e) {
        // CENTRALIZED CATCH: Guarantees INTERNAL_ERROR_RESPONSE_FAILED on any throw
        console.error('Error processing webhook:', e);
        const errorLang = (user && user.language) ? user.language : 'english';
        responseText = fallbackMessage.getMessage(fallbackMessage.INTERNAL_ERROR_RESPONSE_FAILED, errorLang);
    } finally {
        // Centralized point for sending message (runs only once, handles all paths)
        if (responseText) {
            await sendMessage(phoneNumber, responseText);
        }
        res.status(200).end();
    }
};
