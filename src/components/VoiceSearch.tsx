import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceSearchProps {
  onVoiceResult: (text: string) => void;
}

export function VoiceSearch({ onVoiceResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setIsSupported(false);
    }
  }, [browserSupportsSpeechRecognition]);

  const handleVoiceSearch = () => {
    if (!isSupported) {
      console.warn('Speech recognition is not supported in this browser');
      return;
    }

    if (!isListening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    } else {
      SpeechRecognition.stopListening();
      setIsListening(false);
      if (transcript) {
        onVoiceResult(transcript);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleVoiceSearch}
        className={`p-3 rounded-full transition-all duration-300 ${
          isListening ? 'bg-red-500/80 hover:bg-red-600/80' : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        {isListening ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/60 backdrop-blur-xl rounded-xl px-4 py-2 min-w-[200px] text-center"
          >
            <p className="text-white text-sm">{transcript || "Listening..."}</p>
            <div className="flex justify-center space-x-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [1, 2, 1],
                    backgroundColor: ["rgb(59 130 246 / 0.5)", "rgb(59 130 246)", "rgb(59 130 246 / 0.5)"]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-1 h-4 bg-blue-500/50 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}