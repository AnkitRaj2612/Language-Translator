import React, { useState } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [translatedHindi, setTranslatedHindi] = useState('');
  const [translatedEnglish, setTranslatedEnglish] = useState('');
  const [loading, setLoading] = useState(false);

  const { speak } = useSpeechSynthesis();
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const translateText = async () => {
    setLoading(true);
    try {
      const [resHindi, resEnglish] = await Promise.all([
        axios.post('https://libretranslate.de/translate', {
          q: inputText,
          source: 'auto',
          target: 'hi',
          format: 'text'
        }),
        axios.post('https://libretranslate.de/translate', {
          q: inputText,
          source: 'auto',
          target: 'en',
          format: 'text'
        })
      ]);
      setTranslatedHindi(resHindi.data.translatedText);
      setTranslatedEnglish(resEnglish.data.translatedText);
    } catch (error) {
      alert('Translation failed. Please check your internet or API.');
    }
    setLoading(false);
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'hi-IN' }); // Hindi mic input
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setInputText(transcript);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '600px', margin: 'auto' }}>
      <h2>🌐 Indian Language Translator</h2>

      <textarea
        rows="4"
        placeholder="Type or use mic to input..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      ></textarea>

      <div style={{ marginTop: '10px' }}>
        <button onClick={startListening}>🎙 Start Mic</button>
        <button onClick={stopListening} style={{ marginLeft: '10px' }}>
          🛑 Stop Mic
        </button>
      </div>

      <button onClick={translateText} disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Translating...' : 'Translate'}
      </button>

      {translatedHindi && (
        <div style={{ marginTop: '20px' }}>
          <h3>Hindi (हिंदी):</h3>
          <p>{translatedHindi}</p>
          <button onClick={() => speak({ text: translatedHindi, lang: 'hi-IN' })}>🔊 Listen Hindi</button>
        </div>
      )}

      {translatedEnglish && (
        <div style={{ marginTop: '20px' }}>
          <h3>English:</h3>
          <p>{translatedEnglish}</p>
          <button onClick={() => speak({ text: translatedEnglish, lang: 'en-US' })}>🔊 Listen English</button>
        </div>
      )}
    </div>
  );
};

export default App;
