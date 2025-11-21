# 💪 AI Fitness Coach App

An AI-powered fitness assistant built using **React** that generates **personalized workout and diet plans** using OpenAI GPT-3.5-turbo.

It also includes voice and image generation features for a more immersive experience.

## 🚀 Features

### 📝 User Input
Users can provide their details like:
- Name, Age, Gender
- Height & Weight
- Fitness Goal (Weight Loss, Muscle Gain, etc.)
- Current Fitness Level (Beginner / Intermediate / Advanced)
- Workout Location (Home / Gym / Outdoor)
- Dietary Preferences (Veg / Non-Veg / Vegan / Keto)
- Optional fields like Medical history, stress level etc.

### 🧠 AI-Powered Plan Generation
The app uses **Google Gemini Pro** to generate:
- 🏋️ **Workout Plan** — with daily exercise routines, sets, reps, and rest time
- 🥗 **Diet Plan** — meal breakdown for breakfast, lunch, dinner, and snacks
- 💬 **AI Tips & Motivation** — lifestyle and posture tips, motivational lines

### 🔊 Voice Features
- **Read My Plan** — Uses **ElevenLabs** for high-quality text-to-speech (fallback to Web Speech API)
- Option to choose which section to listen to — *Workout or Diet*

### 🖼️ Image Generation
- When user clicks an exercise or meal item, the app uses **Replicate Stable Diffusion** to generate a **visual representation** of that workout or food
- Examples: "Barbell Squat" → realistic gym exercise image, "Grilled Chicken Salad" → food-style image

### 🧾 Export & Extra Features
- 📄 Export generated plan as PDF
- 🌗 Dark / Light mode
- 💾 Save plan in local storage
- 🧩 Regenerate Plan option
- ⚡ Smooth UI with Framer Motion animations
- 💬 Daily "Motivation Quote" section

## 🛠️ Tech Stack

| Category | Tools |
| --- | --- |
| Frontend | React.js |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| AI APIs | Google Gemini Pro |
| Voice | ElevenLabs (Web Speech API fallback) |
| Images | Replicate Stable Diffusion |
| PDF Export | jsPDF |
| Icons | Emoji Icons |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ai_fitness_coach_app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your API keys:
- `REACT_APP_GEMINI_API_KEY` - Google Gemini API key for AI plan generation
- `REACT_APP_ELEVENLABS_API_KEY` - ElevenLabs API key for text-to-speech
- `REACT_APP_REPLICATE_API_TOKEN` - Replicate API token for image generation

4. Start the development server
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## 📱 Usage

1. **Fill out the form** with your personal details and fitness preferences
2. **Generate your plan** by clicking the "Generate My Fitness Plan" button
3. **View your personalized plan** with tabs for Workout, Diet, and AI Tips
4. **Listen to your plan** using the "Read Aloud" feature
5. **Generate images** by clicking the image icon next to exercises or meals
6. **Export as PDF** to save your plan offline
7. **Toggle dark/light mode** using the theme switcher

## 🔧 Configuration

### API Integration

The app is configured to use real AI APIs with fallback to mock implementations:

1. **AI Plan Generation**: Google Gemini Pro (fallback to intelligent mock data)
2. **Text-to-Speech**: ElevenLabs (fallback to Web Speech API)
3. **Image Generation**: Replicate Stable Diffusion (fallback to curated Unsplash images)

### Customization

- **Styling**: Modify `tailwind.config.js` and `src/index.css`
- **Components**: Update components in `src/components/`
- **API Services**: Modify services in `src/utils/`

## 📦 Build

To create a production build:

```bash
npm run build
```

The build folder will contain the optimized production files ready for deployment.

## 🚀 Deployment

This app can be deployed to:
- **Vercel** (recommended for React apps)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Create React App for the initial setup
- Tailwind CSS for styling
- Framer Motion for animations
- Google for Gemini Pro API
- ElevenLabs for text-to-speech
- Replicate for image generation
- Unsplash for placeholder images