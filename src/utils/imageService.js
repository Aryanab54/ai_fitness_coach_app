export const generateImage = async (item, type) => {
  console.log('🎨 IMAGE DEBUG: === STARTING IMAGE GENERATION ===');
  console.log('🎨 IMAGE DEBUG: Item:', item);
  console.log('🎨 IMAGE DEBUG: Type:', type);
  console.log('🎨 IMAGE DEBUG: Timestamp:', new Date().toISOString());
  console.log('🔑 IMAGE DEBUG: API Key Present:', !!process.env.REACT_APP_GEMINI_API_KEY);
  console.log('🔑 IMAGE DEBUG: API Key Length:', process.env.REACT_APP_GEMINI_API_KEY?.length || 0);
  
  const prompt = `Create a detailed visual description for: ${item} ${type === 'exercise' ? 'exercise demonstration' : 'healthy food'}. Return only a single detailed description.`;
  console.log('📝 IMAGE DEBUG: Prompt:', prompt);
  
  try {
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };
    
    console.log('📤 IMAGE DEBUG: Request Body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📡 IMAGE DEBUG: Response Status:', response.status);
    console.log('📡 IMAGE DEBUG: Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📊 IMAGE DEBUG: Full Response Data:', JSON.stringify(data, null, 2));
    
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('📝 IMAGE DEBUG: Extracted Description:', description);
    
    if (description) {
      console.log('✅ IMAGE DEBUG: Description generated successfully');
      
      // Create AI image generation prompt from Gemini description
      const createImagePrompt = (description, originalItem) => {
        // Extract key visual elements from Gemini description
        const prompt = type === 'exercise' 
          ? `${originalItem} exercise demonstration, fitness photography, gym setting, realistic, high quality`
          : `${originalItem} healthy food, professional food photography, appetizing, realistic, high quality`;
        
        return prompt.replace(/[*[\]]/g, '').trim();
      };
      
      const imagePrompt = createImagePrompt(description, item);
      console.log('🎨 IMAGE DEBUG: AI Image Prompt:', imagePrompt);
      
      // Generate AI image using Pollinations API (free)
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const selectedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Math.abs(item.split('').reduce((a, b) => a + b.charCodeAt(0), 0))}`;
      
      console.log('🎯 IMAGE DEBUG: Item for AI generation:', item);
      console.log('🎯 IMAGE DEBUG: Type for AI generation:', type);
      console.log('🎯 IMAGE DEBUG: AI Generated Image URL:', selectedUrl);
      console.log('✅ IMAGE DEBUG: === IMAGE GENERATION SUCCESSFUL ===');
      
      return selectedUrl;
    }
    
    console.error('❌ IMAGE DEBUG: No description in response');
    throw new Error('No description generated');
    
  } catch (error) {
    console.error('❌ IMAGE DEBUG: === IMAGE GENERATION FAILED ===');
    console.error('❌ IMAGE DEBUG: Error Message:', error.message);
    console.error('❌ IMAGE DEBUG: Error Stack:', error.stack);
    throw error;
  }
};
