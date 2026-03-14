# 🧺 Bosch Auto-Delay Scheduler

A sleek, mobile-friendly React application designed to take the math out of scheduling your Bosch washing machine and dryer. 

If you want to take advantage of off-peak energy rates (like starting your laundry after 11:00 PM Irish Time), this app calculates exactly how many times you need to press the "Finish in / Delay" button based on the current time and your selected wash cycle.

## ✨ Features

* **🕒 Smart Time Calculation:** Automatically syncs with Irish Time to calculate the exact delay gap needed to start your cycle after your target time.
* **🎛️ Interactive 3D UI:** Features a realistic, CSS-based 3D dial. Includes 16 precisely mapped programs for both the Washer and Dryer, with the most-used cycles highlighted in green.
* **🤖 AI Laundry Assistant:** Integrated with the Gemini API to answer quick laundry questions (e.g., "How to wash a wool sweater?") and recommend the best cycle on the spot.
* **📱 Mobile-First Design:** Fully responsive layout built with Tailwind CSS, designed to feel like a native app on your phone.
* **⚡ Live Feedback:** Shows exactly what the Bosch digital screen *should* display (e.g., "07:30") and estimates the exact start and end times of the cycle.

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **AI Integration:** Google Gemini API (`gemini-2.5-flash`)
* **Deployment:** Ready for Netlify / Vercel

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/bosch-auto-delay.git
cd bosch-auto-delay
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set up your API Key
To enable the Smart Laundry Assistant, you need a free Google Gemini API key.
1. Get your API key from [Google AI Studio](https://aistudio.google.com/).
2. Create a file named \`.env\` in the root of your project.
3. Add your key to the file like this:
\`\`\`env
VITE_GEMINI_API_KEY=your_api_key_here
\`\`\`
*(Note: You will also need to update the \`App.jsx\` file to use \`import.meta.env.VITE_GEMINI_API_KEY\` instead of the hardcoded string).*

### 4. Run the development server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🌍 Deploying

This app is entirely static and can be deployed for free 24/7 on platforms like **Vercel** or **Netlify**. 
* Don't forget to add your \`VITE_GEMINI_API_KEY\` to the **Environment Variables** settings in your deployment dashboard!
