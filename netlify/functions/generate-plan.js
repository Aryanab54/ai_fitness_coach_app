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
- Goal: ${userData.fitnessGoal}, Level: ${userData.fitnessLevel}
- Location: ${userData.workoutLocation}, Diet: ${userData.dietaryPreference}

Provide 3 sections:
**Workout Plan** - weekly exercises with sets/reps
**Diet Plan** - daily meals with calories
**Tips** - motivation and lifestyle advice`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Plan generation failed';
    
    const sections = content.split(/(?=\*\*)/i).filter(s => s.trim());
    const workout = sections.find(s => /workout/i.test(s)) || content;
    const diet = sections.find(s => /diet/i.test(s)) || content;
    const tips = sections.find(s => /tips/i.test(s)) || content;
    
    const plan = { workout, diet, tips };

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