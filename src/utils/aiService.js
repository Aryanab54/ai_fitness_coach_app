export const generateFitnessPlan = async (userData) => {
  try {
    const response = await fetch('/.netlify/functions/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Plan generation failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Plan generation error:', error);
    throw error;
  }
};