export const speakText = async (text) => {
  console.log('🔊 Starting ElevenLabs text-to-speech for:', text.substring(0, 50) + '...');
  console.log('🔑 Using Netlify function for secure API calls');
  console.log('📝 Text length:', text.length);
  
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
    
    const { audioData } = await response.json();
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

export const stopSpeaking = () => {};
export const isSpeaking = () => false;