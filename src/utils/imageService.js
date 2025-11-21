export const generateImage = async (item, type) => {
  try {
    const response = await fetch('/.netlify/functions/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, type })
    });
    
    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.status}`);
    }
    
    const { imageUrl } = await response.json();
    return imageUrl;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
};