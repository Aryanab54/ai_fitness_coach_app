exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { item, type } = JSON.parse(event.body);
    
    console.log('🎨 IMAGE DEBUG: === STARTING IMAGE GENERATION ===');
    console.log('🎨 IMAGE DEBUG: Item:', item);
    console.log('🎨 IMAGE DEBUG: Type:', type);
    console.log('🎨 IMAGE DEBUG: Timestamp:', new Date().toISOString());
    
    const prompt = `Create a detailed visual description for: ${item} ${type === 'exercise' ? 'exercise demonstration' : 'healthy food'}. Return only a single detailed description.`;
    console.log('📝 IMAGE DEBUG: Prompt:', prompt);
    
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
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
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      };
    }
    
    console.error('❌ IMAGE DEBUG: No description in response');
    throw new Error('No description generated');
    
  } catch (error) {
    console.error('❌ IMAGE DEBUG: === IMAGE GENERATION FAILED ===');
    console.error('❌ IMAGE DEBUG: Error Message:', error.message);
    throw error;
  }
};