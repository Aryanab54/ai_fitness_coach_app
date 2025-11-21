exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text } = JSON.parse(event.body);
    const cleanText = text.replace(/[🏋️🥗💡🎯💪🔥📈✅❌⚠️🤖⏳🔊]/g, '').replace(/\n+/g, '. ');
    
    // Use only first 300 characters to stay within free tier
    const limitedText = cleanText.substring(0, 300) + (cleanText.length > 300 ? '... Check your full plan below.' : '');
    
    console.log('🔊 ElevenLabs TTS request for text length:', limitedText.length);
    console.log('🔑 API Key present:', !!process.env.ELEVENLABS_API_KEY);
    console.log('🔑 API Key length:', process.env.ELEVENLABS_API_KEY?.length);
    
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: limitedText,
        model_id: 'eleven_turbo_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      })
    });

    console.log('📡 ElevenLabs Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text');
      console.error('❌ ElevenLabs API Error Status:', response.status);
      console.error('❌ ElevenLabs API Error Text:', errorText);
      
      // Return fallback signal for quota exceeded
      if (response.status === 401 && errorText.includes('quota_exceeded')) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fallback: true, text: cleanText })
        };
      }
      
      throw new Error(`ElevenLabs API Error ${response.status}: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    console.log('✅ Audio generated, size:', audioBuffer.byteLength, 'bytes');
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioData: base64Audio })
    };
  } catch (error) {
    console.error('❌ TTS Function Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};