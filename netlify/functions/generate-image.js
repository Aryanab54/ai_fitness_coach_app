exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { item, type } = JSON.parse(event.body);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a detailed visual description for: ${item} ${type === 'exercise' ? 'exercise demonstration' : 'healthy food'}. Return only a single detailed description.`
          }]
        }]
      })
    });

    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (description) {
      const imagePrompt = type === 'exercise' 
        ? `${item} exercise demonstration, fitness photography, gym setting, realistic, high quality`
        : `${item} healthy food, professional food photography, appetizing, realistic, high quality`;
      
      const cleanPrompt = imagePrompt.replace(/[*[\]]/g, '').trim();
      const encodedPrompt = encodeURIComponent(cleanPrompt);
      const seed = Math.abs(item.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}`;
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      };
    }
    
    throw new Error('No description generated');
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};