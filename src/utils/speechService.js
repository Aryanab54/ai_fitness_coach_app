const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;
const isLocal = window.location.hostname === 'localhost';

export const speakText = async (text) => {
  console.log('🔊 Starting ElevenLabs text-to-speech for:', text.substring(0, 50) + '...');
  console.log('📝 Text length:', text.length);
  
  if (isLocal) {
    console.log('🔑 Using local ElevenLabs API (development mode)');
    return await speakWithElevenLabs(text);
  } else {
    console.log('🔑 Using Netlify function for secure API calls');
    return await speakWithNetlify(text);
  }
};

const speakWithNetlify = async (text) => {
  try {
    console.log('🎤 Generating AI voice with ElevenLabs via Netlify...');
    const response = await fetch('/.netlify/functions/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    console.log('📡 TTS Function Response Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Speech generation failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if fallback is needed
    if (data.fallback) {
      console.log('🔄 ElevenLabs quota exceeded, using Web Speech API fallback');
      return await speakWithWebSpeech(data.text);
    }
    
    const { audioData } = data;
    console.log('🎧 Audio data received, converting to blob...');
    
    const audioBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
    console.log('🎧 Audio blob size:', audioBlob.size, 'bytes');
    
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
  } catch (error) {
    console.error('❌ Speech error:', error);
    throw error;
  }
};

const speakWithElevenLabs = async (text) => {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
    throw new Error('🔑 ElevenLabs API key is required for text-to-speech. Please add your API key to the .env file.');
  }
  
  const cleanText = text.replace(/[🏋️🥗💡🎯💪🔥📈✅❌⚠️🤖⏳🔊]/g, '').replace(/\n+/g, '. ');
  
  console.log('📝 Clean text length:', cleanText.length);
  console.log('🎤 Using voice: Sarah (EXAVITQu4vr4xnSDxMaL)');
  console.log('🤖 Using model: eleven_turbo_v2');
  
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
      voice_settings: { stability: 0.5, similarity_boost: 0.5 }
    })
  });
  
  console.log('📡 ElevenLabs Response Status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ ElevenLabs API Error:', errorData);
    throw new Error(`ElevenLabs API Error ${response.status}: ${errorData.detail?.message || 'API request failed'}`);
  }
  
  const audioBlob = await response.blob();
  console.log('🎧 Audio blob size:', audioBlob.size, 'bytes');
  
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

const speakWithWebSpeech = async (text) => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Web Speech API not supported'));
      return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Limit text length for Web Speech API (max ~32767 chars)
    const limitedText = text.length > 1000 ? text.substring(0, 1000) + '... Check your full plan on screen.' : text;
    
    const utterance = new SpeechSynthesisUtterance(limitedText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      console.log('✅ Web Speech API completed');
      resolve();
    };
    
    utterance.onerror = (error) => {
      console.error('❌ Web Speech API error:', error);
      window.speechSynthesis.cancel();
      reject(error);
    };
    
    window.speechSynthesis.speak(utterance);
    console.log('🔊 Using Web Speech API fallback for', limitedText.length, 'characters');
  });
};

export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    console.log('⏹️ Speech stopped');
  }
};

export const isSpeaking = () => {
  return window.speechSynthesis ? window.speechSynthesis.speaking : false;
};