const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;

export const speakText = async (text) => {
  console.log('🔊 Starting ElevenLabs text-to-speech for:', text.substring(0, 50) + '...');
  console.log('🔑 ElevenLabs API Key format check:', ELEVENLABS_API_KEY ? 'PASSED' : 'FAILED');
  console.log('🔑 ElevenLabs API Key length:', ELEVENLABS_API_KEY?.length || 0);
  
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
    throw new Error('🔑 ElevenLabs API key is required for text-to-speech. Please add your API key to the .env file.');
  }
  
  console.log('🎤 Generating AI voice with ElevenLabs');
  await speakWithElevenLabs(text);
  console.log('✅ AI voice generated successfully');
};

const speakWithElevenLabs = async (text) => {
  const cleanText = text.replace(/[🏋️🥗💡🎯💪🔥📈✅❌⚠️🤖⏳🔊]/g, '').replace(/\n+/g, '. ');
  
  console.log('📝 Clean text length:', cleanText.length);
  console.log('🎤 Using voice: Sarah (EXAVITQu4vr4xnSDxMaL)');
  console.log('🤖 Using model: eleven_turbo_v2');
  console.log('🔑 Using ElevenLabs API key:', ELEVENLABS_API_KEY ? 'Present' : 'Missing');
  
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text: cleanText,
      model_id: 'eleven_turbo_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  });
  
  console.log('📡 ElevenLabs Response Status:', response.status);
  console.log('📡 ElevenLabs Response Headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ ElevenLabs API Error:', errorData);
    throw new Error(`ElevenLabs API Error ${response.status}: ${errorData.detail?.message || 'API request failed'}`);
  }
  
  const audioBlob = await response.blob();
  console.log('🎧 Audio blob size:', audioBlob.size, 'bytes');
  console.log('🎧 Audio blob type:', audioBlob.type);
  
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  
  console.log('🔊 Playing audio...');
  
  return new Promise((resolve, reject) => {
    audio.onended = () => {
      console.log('✅ Audio playback completed');
      URL.revokeObjectURL(audioUrl);
      resolve();
    };
    audio.onerror = (error) => {
      console.error('❌ Audio playback error:', error);
      URL.revokeObjectURL(audioUrl);
      reject(error);
    };
    audio.play().catch(error => {
      console.error('❌ Audio play failed:', error);
      reject(error);
    });
  });
};

export const stopSpeaking = () => {
  console.log('Stop speaking requested');
};

export const isSpeaking = () => {
  return false;
};