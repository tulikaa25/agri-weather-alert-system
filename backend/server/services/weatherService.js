//fetching data from the weather API
import axios from 'axios';
import 'dotenv/config';

// Logic for interacting with the Weather API
export const getWeatherData = async (city) => {
    const apiKey = process.env.WEATHER_API_KEY;
    const baseUrl = process.env.WEATHER_API_BASE_URL;
    
    // API endpoint for current day's forecast and tomorrow's forecast
    const endpoint = `v1/forecast.json?key=${apiKey}&q=${city}&days=2&aqi=no&alerts=no`;

    const url = baseUrl + endpoint;

    try {
      
        const response = await axios.get(url);
       
        // Return the full weather data object
        return response.data;
    } catch (e) {
        console.error("Error calling Weather API:", e.message);
        return null;
    }
};
