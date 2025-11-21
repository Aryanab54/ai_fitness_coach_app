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
    
    const prompt = `Create a concise fitness plan for ${userData.name} (${userData.age}yr, ${userData.gender}, ${userData.height}cm, ${userData.weight}kg, Goal: ${userData.fitnessGoal}, Level: ${userData.fitnessLevel}, Location: ${userData.workoutLocation}, Diet: ${userData.dietaryPreference}).

Format exactly like this:

**Workout Plan:**
Brief intro paragraph about the plan focus.

**Day 1: [Workout Type]**
- Exercise 1: sets x reps
- Exercise 2: sets x reps
- Exercise 3: sets x reps

**Day 2: [Workout Type]**
- Exercise 1: sets x reps
- Exercise 2: sets x reps

**Day 3: Rest or Active Recovery**

**Diet Plan:**
**Breakfast (calories):**
- Food item 1
- Food item 2

**Lunch (calories):**
- Food item 1
- Food item 2

**Dinner (calories):**
- Food item 1
- Food item 2

**Snacks (calories):**
- Snack 1
- Snack 2

**Tips:**
- Tip 1
- Tip 2
- Tip 3
- Tip 4

Keep it concise and structured. No long explanations.`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Plan generation failed';
    
    // Parse content into sections based on actual structure
    const workoutStart = content.search(/workout\s*plan/i);
    const dietStart = content.search(/diet\s*plan/i);
    const tipsStart = content.search(/(ai\s*tips|tips\s*&\s*motivation|lifestyle\s*tips)/i);
    
    let workout = '', diet = '', tips = '';
    
    if (workoutStart !== -1) {
      const workoutEnd = dietStart !== -1 ? dietStart : (tipsStart !== -1 ? tipsStart : content.length);
      workout = content.substring(workoutStart, workoutEnd).trim();
    }
    
    if (dietStart !== -1) {
      const dietEnd = tipsStart !== -1 ? tipsStart : content.length;
      diet = content.substring(dietStart, dietEnd).trim();
    }
    
    if (tipsStart !== -1) {
      tips = content.substring(tipsStart).trim();
    }
    
    // Fallback if sections not found
    if (!workout && !diet && !tips) {
      workout = content;
      diet = content;
      tips = content;
    }
    
    const plan = { workout: workout || content, diet: diet || content, tips: tips || content };

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