export const generateImage = async (item, type) => {
  console.log('🎨 IMAGE DEBUG: === STARTING IMAGE GENERATION ===');
  console.log('🎨 IMAGE DEBUG: Item:', item);
  console.log('🎨 IMAGE DEBUG: Type:', type);
  console.log('🎨 IMAGE DEBUG: Timestamp:', new Date().toISOString());
  console.log('🔑 IMAGE DEBUG: Using Netlify function for secure API calls');
  
  try {
    console.log('📤 IMAGE DEBUG: Sending request to Netlify function...');
    const response = await fetch('/.netlify/functions/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, type })
    });
    
    console.log('📡 IMAGE DEBUG: Function Response Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.status}`);
    }
    
    const { imageUrl } = await response.json();
    console.log('🎯 IMAGE DEBUG: Item for AI generation:', item);
    console.log('🎯 IMAGE DEBUG: Type for AI generation:', type);
    console.log('🎯 IMAGE DEBUG: AI Generated Image URL:', imageUrl);
    console.log('✅ IMAGE DEBUG: === IMAGE GENERATION SUCCESSFUL ===');
    
    return imageUrl;
  } catch (error) {
    console.error('❌ IMAGE DEBUG: === IMAGE GENERATION FAILED ===');
    console.error('❌ IMAGE DEBUG: Error Message:', error.message);
    throw error;
  }
};