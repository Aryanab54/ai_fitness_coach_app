const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const isLocal = window.location.hostname === 'localhost';

export const generateImage = async (item, type) => {
  console.log('🎨 IMAGE DEBUG: === STARTING IMAGE GENERATION ===');
  console.log('🎨 IMAGE DEBUG: Item:', item);
  console.log('🎨 IMAGE DEBUG: Type:', type);
  console.log('🎨 IMAGE DEBUG: Timestamp:', new Date().toISOString());
  
  if (isLocal) {
    console.log('🔑 IMAGE DEBUG: Using local Gemini API (development mode)');
    return await generateImageLocal(item, type);
  } else {
    console.log('🔑 IMAGE DEBUG: Using Netlify function for secure API calls');
    return await generateImageNetlify(item, type);
  }
};

const generateImageNetlify = async (item, type) => {
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
    console.log('🎯 IMAGE DEBUG: AI Generated Image URL:', imageUrl);
    console.log('✅ IMAGE DEBUG: === IMAGE GENERATION SUCCESSFUL ===');
    
    return imageUrl;
  } catch (error) {
    console.error('❌ IMAGE DEBUG: === IMAGE GENERATION FAILED ===');
    console.error('❌ IMAGE DEBUG: Error Message:', error.message);
    throw error;
  }
};

const generateImageLocal = async (item, type) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('🔑 Gemini API key is required for image generation. Please add your API key to the .env file.');
  }
  
  const prompt = `Create a detailed visual description for: ${item} ${type === 'exercise' ? 'exercise demonstration' : 'healthy food'}. Return only a single detailed description.`;
  console.log('📝 IMAGE DEBUG: Prompt:', prompt);
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    console.log('📡 IMAGE DEBUG: Response Status:', response.status);
    
    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('📝 IMAGE DEBUG: Extracted Description:', description);
    
    if (description) {
      console.log('✅ IMAGE DEBUG: Description generated successfully');
      
      const imagePrompt = type === 'exercise' 
        ? `${item} exercise demonstration, fitness photography, gym setting, realistic, high quality`
        : `${item} healthy food, professional food photography, appetizing, realistic, high quality`;
      
      const cleanPrompt = imagePrompt.replace(/[*[\]]/g, '').trim();
      console.log('🎨 IMAGE DEBUG: AI Image Prompt:', cleanPrompt);
      
      const encodedPrompt = encodeURIComponent(cleanPrompt);
      const seed = Math.abs(item.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}`;
      
      console.log('🎯 IMAGE DEBUG: AI Generated Image URL:', imageUrl);
      console.log('✅ IMAGE DEBUG: === IMAGE GENERATION SUCCESSFUL ===');
      
      return imageUrl;
    }
    
    console.error('❌ IMAGE DEBUG: No description in response');
    throw new Error('No description generated');
    
  } catch (error) {
    console.error('❌ IMAGE DEBUG: === IMAGE GENERATION FAILED ===');
    console.error('❌ IMAGE DEBUG: Error Message:', error.message);
    throw error;
  }
};