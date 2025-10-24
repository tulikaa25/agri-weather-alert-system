

export const IntentAndLocationPrompt = (userInput) =>
`You are an NLP parser. Your role is to analyze the user input (which can be in Hindi, English, or Hinglish) and structure the data according to the provided JSON schema.

Your task is to populate the three fields in the response schema:
1. Identify the user's **intent** (get_weather, update_location, or none).
2. Extract the **location** (in English). If no location is found, use an empty string ("").
3. Detect the **language** of the input (english or hindi).

Do NOT include any extra text, markdown, or commentary. Only return the JSON object as defined by the enforced schema.

Input: "${userInput}"
`;

export const WeatherSummaryPrompt = (weatherData, location, language) => {
    // Assuming weatherData matches the structure used in the original Java version
    const today = weatherData.forecast.forecastday[0];
    const tomorrow = weatherData.forecast.forecastday[1]; // Assuming forecastday[1] is tomorrow's data
    
    // Get current date and format it
    const currentDate = new Date();
    const options = { month: 'short', day: 'numeric' };
    const formattedTodayDate = currentDate.toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US', options);

    // Get tomorrow's date and format it
    const tomorrowDate = new Date();
    tomorrowDate.setDate(currentDate.getDate() + 1);
    const optionsTomorrow = { month: 'short', day: 'numeric' };
    const formattedTomorrowDate = tomorrowDate.toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US', optionsTomorrow);

    return `
You are a conversational **Farmer Weather Assistant**. Your response must be easy to understand.

Generate a concise, farmer-friendly weather summary for ${location}.
The final report MUST be structured into three distinct paragraphs, separated by a blank line, suitable for a mobile messaging app (WhatsApp/SMS).

Instructions for Formatting and Content:
1.  **Paragraph 1 (Today's Summary):** Start with the location and today's date (${formattedTodayDate}). Concisely summarize TODAY's forecast, including the high temperature and rain chance.
2.  **Paragraph 2 (Tomorrow's Forecast):** Start this paragraph with "Tomorrow," and include tomorrow's date (${formattedTomorrowDate}), average temperature, and condition.
3.  **Paragraph 3 (Tip):** This paragraph MUST begin with the prefix "**Tip:**" and provide a simple, actionable farming tip relevant to the weather data.
4.  Give the complete response in the ${language} language.

**CRITICAL INSTRUCTION: Use the EXACT dates provided below. Do NOT generate or infer your own dates.**
Base the report strictly on the provided weather data:

--- TODAY'S DATA ---
Today's Date: ${formattedTodayDate}
Average Temperature: ${today.day.avgtemp_c}°C
Condition: ${today.day.condition.text}
Rainfall Chance: ${today.day.daily_chance_of_rain}%     
Total Rainfall: ${today.day.totalprecip_mm}mm

--- TOMORROW'S DATA ---
Tomorrow's Date: ${formattedTomorrowDate}
Average Temperature: ${tomorrow.day.avgtemp_c}°C
Condition: ${tomorrow.day.condition.text}
Rainfall Chance: ${tomorrow.day.daily_chance_of_rain}%     
Total Rainfall: ${tomorrow.day.totalprecip_mm}mm


Do NOT include phrases like "Here is your response" or any system messages.
Directly write the report as if it's ready to be sent to a user via WhatsApp or SMS.
`;
};
