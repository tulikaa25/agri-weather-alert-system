const Language = {
    ENGLISH: 'english',
    HINDI: 'hindi'
};

const fallbackMessage = { //default msgs for various scenarios
 WEATHER_FETCH_FAILED: {
 english: "Could not receive weather information.",
 hindi: "मौसम की जानकारी प्राप्त नहीं हो सकी"
 },
 LOCATION_UPDATE_SUCCESS: {
 english: "Your Location updated to: %s. Now you will receive weather alerts for this location.",
 hindi: "आपका स्थान अपडेट कर दिया गया है: %s. अब आपको इस स्थान के लिए मौसम अलर्ट प्राप्त होंगे।" 
},
    // *** FIX: Updated Content for 503 Server Unavailable Error *** 
    INTERNAL_ERROR_RESPONSE_FAILED: {
    english: "Our weather service is temporarily busy due to high demand. Please try sending your request again in a minute.",
    hindi: "हमारी मौसम सेवा इस समय व्यस्त है। कृपया एक मिनट बाद अपना अनुरोध दोबारा भेजें।"
},
    // *** FIX: Updated Content for UNKNOWN_REQUEST (Better Guidance) ***
     UNKNOWN_REQUEST: {
    english: "I couldn't understand your request. Please send a city name (e.g., Lucknow) or ask for a weather update.",
    hindi: "मुझे आपका अनुरोध समझ नहीं आया। कृपया शहर का नाम (उदाहरण: लखनऊ) भेजें या मौसम की जानकारी पूछें।"
 },
 WEATHER_INFO_UNAVAILABLE: {
 english: "Weather information is currently unavailable. Please try again later.",
  hindi: "मौसम की जानकारी वर्तमान में उपलब्ध नहीं है। कृपया बाद में पुनः प्रयास करें।"
 },
 getMessage(messageKey, language) {
    const messageObject = this[messageKey];
    if (messageObject && messageObject[language]) {
        return messageObject[language];
    } else {
        // Fallback in case of invalid key or language
        return this.UNKNOWN_REQUEST[Language.ENGLISH];
    }
 }
};

export { Language, fallbackMessage };
