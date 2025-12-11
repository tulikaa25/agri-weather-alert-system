# 🌾☁️ AgriWeather Alert System

## 📌 Project Description

### 🎯 Problem Statement

Many farmers, especially in rural areas, are not comfortable using smartphones or typing queries online. However, they can read messages and make phone calls. They often rely on rumors or second-hand weather advice, which sometimes leads to uninformed crop decisions.

---



### ✅ Solution Overview

AgriWeather Alert System automates the delivery of weather updates via SMS, WhatsApp, and voice calls in Hindi and
English, requiring no technical skills or interactions from the farmers. It runs scheduled weather checks twice a day
and sends easy-to-understand messages or provides weather information through voice calls.

### 🌾 Key Benefits

1. **No smartphone or internet required for voice calls** — farmers can simply dial a number from any basic phone and
   speak their city name to get weather updates in their language.

2. **Fully supports non-tech-savvy users** — especially useful for farmers who cannot operate apps or browse the
   internet.
3. **Multiple channels available:**

    * 📞 **Voice Call (no internet or smartphone needed)**
    * 📩**SMS & WhatsApp (requires a phone with basic or smart messaging capability)**

4. **Language preference** — farmers choose Hindi or English at the start of the call, and all updates follow in that
   language.

5. **Natural interaction** — speak the city name in your voice; no need to type or navigate menus.

6. **Daily updates automatically** — once a location is set as primary, updates are sent every day without having to
   call or message again.

7. Saves time and effort — no need to wait for newspapers or depend on others for weather info.

8. Accurate and reliable — based on real-time weather data and summarized in a farmer-friendly format.

---

## 🛠️ Setup Instructions

1. Install **Node.js** or higher
2. Install **npm**
3. Create accounts for the following services:
    * [Twilio](https://www.twilio.com/) : For messaging and WhatsApp integration.
    * [Google Cloud AI Gemini](https://aistudio.google.com/) : For AI capabilities.
    * Weather API provider (e.g., OpenWeatherMap) : for weather data.
4. Configure credentials in `.env` File:

   ```properties
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_WHATSAPP_NUMBER=...
   GEMINI_API_KEY=...
   WEATHER_API_KEY=...
   MONGO_URI=...
   ```
5. Build the application:

   ```bash
   npm install
   ```
6. Run the application:

   ```bash
   node index.js
   ```

> By default, the application runs on **http://localhost:4000**

---

## ▶️ Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/agri-weather-alert-system.git
cd agri-weather-alert-system
```

### 2. Install dependencies and start the application

```bash
npm install 
node index.js
```

---

## 🌐 Expose Localhost using Ngrok

### 1. Install [Ngrok](https://ngrok.com/download)

### 2. Start a tunnel:

```bash
ngrok http 4000
```

Copy the HTTPS URL from the terminal output (e.g., `https://abcd1234.ngrok.io`).

---

## 💬 Configure Twilio Sandbox

### 1. Log in to the [Twilio Console](https://www.twilio.com/console).

### 2. Go to **Messaging > Try it Out > WhatsApp Sandbox**.

### 3. Set the **Webhook URL** to:

```
https://your-ngrok-url.ngrok.io/api/webhook/whatsapp
```

### 4. Join the sandbox by sending the join code (e.g., `join brave-owl`) to the provided WhatsApp number.



---

## 📞 Voice Call Setup

1. In your Twilio account, navigate to **Phone Numbers > Manage > Active numbers** and select your Twilio phone number.
2. In the **Voice & Fax** section, configure the **A Call Comes In** setting to use a **Webhook**.
3. Set the **Webhook URL** to your Ngrok URL with the `/api/voice` endpoint (
   e.g., `https://your-ngrok-url.ngrok.io/api/voice`).
4. Make sure the HTTP method is set to **POST**.

---

## 🕒 Scheduling

To automatically send alerts once a day, configure a cron job or use Spring’s `@Scheduled` annotation in your service
class.

Example:

```java

@Scheduled(cron = "0 0 5,17 * * *") // 7:00 AM daily
public void sendWeatherAlerts() {
    // alert logic here
}
```

---

## 📱 User View (WhatsApp)

### 1. Update Location (via WhatsApp or Call)



### 2. Language Friendly

* #### In english



* ##### In Hindi



### 3. Automatically Scheduled Alerts

Alerts sent at set time daily.

---

## 📞 User View (Voice Call)

### 1. Call the Given Number



### 2. Select the language choice

* Listen to the call instructions (e.g., press 1 for Hindi, 2 for English).
* After selecting the language, all further communication will be in that language.

### 3. Get Weather Updates

* Speak the city name for which you want weather updates.
* Listen to the weather updates.

### 4. Set Primary Location

* press the instructed key to if you want to set this city as your primary location.
* Once set, you will receive daily weather updates via SMS/WhatsApp for that location.

---


## 📩 Contact

If you have any contributions, questions, or concerns, please open an issue or reach out to me
on [LinkedIn](https://www.linkedin.com/in/tulika-basu-580547251).

---
<!-- 
## 📝 License

This project is licensed under the [MIT License](LICENSE).

--- -->
