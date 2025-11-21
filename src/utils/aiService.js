const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export const generateFitnessPlan = async (userData) => {
  console.log('🤖 Generating AI-powered fitness plan for', userData.name);
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('🔑 Gemini API key is required for AI-powered plan generation. Please add your API key to the .env file.');
  }
  
  const plan = await generateWithGemini(userData);
  console.log('✅ AI plan generated successfully');
  return plan;
};

const generateWithGemini = async (userData) => {
  const prompt = `Create a personalized fitness plan for ${userData.name}:
- Age: ${userData.age}, Gender: ${userData.gender}
- Height: ${userData.height}cm, Weight: ${userData.weight}kg
- Goal: ${userData.fitnessGoal}
- Level: ${userData.fitnessLevel}
- Location: ${userData.workoutLocation}
- Diet: ${userData.dietaryPreference}

Format response as:
WORKOUT:
[3-day workout plan with exercises, sets, reps]

DIET:
[Daily meal plan with breakfast, lunch, dinner, snacks]

TIPS:
[5 personalized fitness tips]`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  console.log('📡 Gemini Response Status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Gemini API Error:', errorData);
    throw new Error(`Gemini API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  console.log('✅ Gemini API Response received');
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }
  
  const aiResponse = data.candidates[0].content.parts[0].text;
  console.log('📝 AI Response length:', aiResponse.length);
  
  const sections = aiResponse.split(/WORKOUT:|DIET:|TIPS:/);
  
  return {
    workout: sections[1]?.trim() || aiResponse,
    diet: sections[2]?.trim() || 'Diet plan will be customized based on your preferences',
    tips: sections[3]?.trim() || 'Personalized tips will be provided based on your fitness level'
  };
};