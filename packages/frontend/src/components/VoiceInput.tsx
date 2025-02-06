import React, { useState, useEffect, useRef } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";
import { VoiceLevelIndicator } from "./VoiceLevelIndicator";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  isListening,
  setIsListening,
}) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const analyzer = useRef<AnalyserNode | null>(null);
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrame = useRef<number>();

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");

        onTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }

    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    if (microphone.current) {
      microphone.current.disconnect();
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
  };

  const analyzeAudio = () => {
    if (!analyzer.current) return;

    const dataArray = new Uint8Array(analyzer.current.frequencyBinCount);
    analyzer.current.getByteFrequencyData(dataArray);

    const average =
      dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const level = Math.min(100, (average / 128) * 100);
    setVoiceLevel(level);

    animationFrame.current = requestAnimationFrame(analyzeAudio);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio analysis
      audioContext.current = new AudioContext();
      analyzer.current = audioContext.current.createAnalyser();
      microphone.current = audioContext.current.createMediaStreamSource(stream);
      analyzer.current.fftSize = 256;
      microphone.current.connect(analyzer.current);
      analyzeAudio();

      if (recognition) {
        recognition.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopListening = () => {
    cleanup();
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    setVoiceLevel(0);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative">
      {isListening && <VoiceLevelIndicator level={voiceLevel} />}
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition-all duration-300 ${
          isListening
            ? "bg-neon-blue text-black animate-pulse"
            : "bg-dark-secondary hover:bg-neon-blue/20"
        }`}
        title={isListening ? "Stop listening" : "Start voice command"}
      >
        {isListening ? (
          <StopIcon className="w-6 h-6" />
        ) : (
          <MicrophoneIcon className="w-6 h-6 text-neon-blue" />
        )}
      </button>
    </div>
  );
};
