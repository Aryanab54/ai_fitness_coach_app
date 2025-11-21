exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const userData = JSON.parse(event.body);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a personalized fitness plan for: Name: ${userData.name}, Age: ${userData.age}, Gender: ${userData.gender}, Height: ${userData.height}cm, Weight: ${userData.weight}kg, Goal: ${userData.fitnessGoal}, Level: ${userData.fitnessLevel}, Location: ${userData.workoutLocation}, Diet: ${userData.dietaryPreference}. Include workout plan, diet plan, and tips.`
          }]
        }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Plan generation failed';
    
    const sections = content.split(/(?=\*\*(?:Workout|Diet|Tips))/i);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workout: sections.find(s => /workout/i.test(s)) || 'Workout plan not available',
        diet: sections.find(s => /diet/i.test(s)) || 'Diet plan not available', 
        tips: sections.find(s => /tips/i.test(s)) || 'Tips not available'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};