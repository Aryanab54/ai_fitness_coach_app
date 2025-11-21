exports.handler = async (event, context) => {
  // Set timeout to 10 seconds
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const userData = JSON.parse(event.body);
    
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
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Plan generation failed';
    
    // Parse using original local method
    const sections = content.split(/WORKOUT:|DIET:|TIPS:/);
    
    const plan = {
      workout: sections[1]?.trim() || content,
      diet: sections[2]?.trim() || 'Diet plan will be customized based on your preferences',
      tips: sections[3]?.trim() || 'Personalized tips will be provided based on your fitness level'
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(plan)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};