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
    
    // Simple mock response for testing
    const mockPlan = {
      workout: `**Workout Plan for ${userData.name}**

**Day 1: Upper Body**
- Push-ups: 3 sets x 10-15 reps
- Dumbbell rows: 3 sets x 12 reps
- Shoulder press: 3 sets x 10 reps
- Plank: 3 sets x 30 seconds

**Day 2: Lower Body**
- Squats: 3 sets x 15 reps
- Lunges: 3 sets x 10 per leg
- Calf raises: 3 sets x 15 reps
- Wall sit: 3 sets x 30 seconds

**Day 3: Rest Day**

**Day 4: Full Body**
- Burpees: 3 sets x 8 reps
- Mountain climbers: 3 sets x 20 reps
- Jumping jacks: 3 sets x 30 seconds
- Rest: 1 minute between sets`,

      diet: `**Diet Plan for ${userData.name}**

**Breakfast (400-500 calories):**
- Oatmeal with berries and nuts
- Greek yogurt with honey
- Green tea

**Lunch (500-600 calories):**
- Grilled chicken salad
- Brown rice (1/2 cup)
- Mixed vegetables
- Water

**Dinner (500-600 calories):**
- Baked fish with vegetables
- Sweet potato
- Side salad
- Water

**Snacks (150-200 calories each):**
- Apple with almond butter
- Greek yogurt
- Mixed nuts (small handful)`,

      tips: `**AI Tips & Motivation for ${userData.name}**

**Lifestyle Tips:**
- Stay hydrated: Drink 8-10 glasses of water daily
- Get 7-8 hours of quality sleep
- Take rest days seriously for muscle recovery
- Track your progress weekly

**Motivation:**
- Start small and build consistency
- Celebrate small victories
- Find a workout buddy for accountability
- Remember: Progress over perfection

**Progress Tracking:**
- Take weekly photos
- Measure weight and body measurements
- Keep a workout log
- Note energy levels and mood improvements`
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(mockPlan)
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