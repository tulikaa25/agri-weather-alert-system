import cron from 'node-cron';
import User from '../models/userModel.js';
import { getWeatherData } from '../services/weatherService.js';
import { sendMessage } from '../services/messagingService.js';
import { WeatherSummaryPrompt } from '../utils/promptBuilder.js';
import { callGeminiApi } from '../services/aiService.js';
import { fallbackMessage } from '../enums/fallbackMessage.js';


export const startWeatherAlertScheduler = () => {
    // Schedule the task to run daily at 7:00 AM
    cron.schedule('0 7 * * *', async () => {
        try {
            console.log('Running daily weather alert scheduler...');
            
            // Find all users who have a saved location
            const users = await User.find({ location: { $ne: null } });

            for (const user of users) {
                // Destructure phoneNumber, location, and language from the user object
                const { phoneNumber, location, language} = user;

                // 1. Fetching weather data from weather service 
                const weatherData = await getWeatherData(location);
                
                if (weatherData) {
                    // 2. first build prompt 
                    const prompt = WeatherSummaryPrompt(weatherData, location, language);
                    
                    // 3. passing prompt to ai service 
                    const geminiResponse = await callGeminiApi(prompt);

                    if (geminiResponse && geminiResponse.candidates && geminiResponse.candidates.length > 0) {
                        const geminiResponseText = geminiResponse.candidates[0].content.parts[0].text;
                        // 4.  sending user-friendly response to user after api processing 
                        await sendMessage(phoneNumber, geminiResponseText);
                    } else {
                        // Handle cases where the Gemini API call fails
                        const fallbackMsg = fallbackMessage.getMessage('INTERNAL_ERROR_RESPONSE_FAILED', language);
                        await sendMessage(phoneNumber, fallbackMsg);
                    }
                } else {
                    // Handle cases where the weather API call fails
                    const fallbackMsg = fallbackMessage.getMessage('WEATHER_INFO_UNAVAILABLE', language);
                    await sendMessage(phoneNumber, fallbackMsg);
                }
            }
        } catch (error) {
            console.error('Error in daily weather alert scheduler:', error);
        }
    });
    console.log('Weather alert scheduler started.');
};
