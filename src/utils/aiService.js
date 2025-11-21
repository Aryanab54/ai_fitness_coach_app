export const generateFitnessPlan = async (userData) => {
  console.log('🤖 Generating AI-powered fitness plan for', userData.name);
  console.log('🔑 Using Netlify function for secure API calls');
  
  try {
    console.log('📤 Sending request to Netlify function...');
    const response = await fetch('/.netlify/functions/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    console.log('📡 Netlify Function Response Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Plan generation failed: ${response.status}`);
    }
    
    const plan = await response.json();
    console.log('✅ AI plan generated successfully');
    console.log('📋 Workout Plan Length:', plan.workout?.length || 0);
    console.log('📋 Diet Plan Length:', plan.diet?.length || 0);
    console.log('📋 Tips Length:', plan.tips?.length || 0);
    
    return plan;
  } catch (error) {
    console.error('❌ Plan generation error:', error);
    throw error;
  }
};