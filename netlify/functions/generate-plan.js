exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const userData = JSON.parse(event.body);
    
    const prompt = `Create a comprehensive, personalized fitness plan for the following user:

**Personal Information:**
- Name: ${userData.name}
- Age: ${userData.age} years
- Gender: ${userData.gender}
- Height: ${userData.height} cm
- Weight: ${userData.weight} kg
- Fitness Goal: ${userData.fitnessGoal.replace('-', ' ')}
- Current Fitness Level: ${userData.fitnessLevel}
- Workout Location: ${userData.workoutLocation}
- Dietary Preference: ${userData.dietaryPreference}
${userData.medicalHistory ? `- Medical History: ${userData.medicalHistory}` : ''}
${userData.stressLevel ? `- Stress Level: ${userData.stressLevel}` : ''}

Please provide a detailed plan with the following sections:

**Workout Plan:**
- Create a weekly workout schedule (7 days)
- Include specific exercises, sets, reps, and rest periods
- Tailor exercises to their fitness level and available location
- Consider their fitness goal (weight loss, muscle gain, etc.)

**Diet Plan:**
- Provide daily meal plans (breakfast, lunch, dinner, snacks)
- Include calorie estimates and portion sizes
- Respect their dietary preferences
- Align nutrition with their fitness goals

**AI Tips & Motivation:**
- Provide lifestyle tips and recommendations
- Include motivational advice
- Suggest ways to track progress
- Address potential challenges

Make the plan practical, achievable, and personalized to their specific needs and constraints.`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Plan generation failed';
    
    // Simple split approach - more reliable
    const sections = content.split(/(?=\*\*)/i).filter(s => s.trim());
    
    const workout = sections.find(s => /workout/i.test(s)) || content;
    const diet = sections.find(s => /diet/i.test(s)) || content;
    const tips = sections.find(s => /tips|motivation/i.test(s)) || content;
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workout: workout,
        diet: diet,
        tips: tips
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};