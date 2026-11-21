import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export const useSpeechRecognition = (onTranscript: (chunk: string) => void) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef<boolean>(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest onTranscript callback in a ref to avoid effect teardown on parent re-renders
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const isSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const createAndConfigureRecognition = useCallback((): SpeechRecognitionLike | null => {
    if (typeof window === "undefined") return null;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) return null;

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let combined = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item && item[0]?.transcript) {
            combined += item[0].transcript + " ";
          }
        }
        const trimmed = combined.trim();
        if (trimmed && onTranscriptRef.current) {
          onTranscriptRef.current(trimmed);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        // "no-speech" is a benign event when the user is silent
        if (event.error === "no-speech") {
          return;
        }

        // "aborted" happens when recognition is intentionally stopped/aborted
        if (event.error === "aborted") {
          return;
        }

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          shouldListenRef.current = false;
          setIsListening(false);
          setError("Microphone permission was denied. Please allow microphone access in your browser settings.");
          return;
        }

        if (event.error === "audio-capture") {
          shouldListenRef.current = false;
          setIsListening(false);
          setError("No microphone was detected. Please verify your audio input device.");
          return;
        }

        if (event.error === "network") {
          setError("Speech recognition network hiccup. Reconnecting...");
          return;
        }

        setError(`Microphone issue: ${event.error}`);
      };

      recognition.onend = () => {
        // If the user hasn't explicitly stopped listening, automatically restart
        if (shouldListenRef.current) {
          if (restartTimerRef.current) {
            clearTimeout(restartTimerRef.current);
          }

          restartTimerRef.current = setTimeout(() => {
            if (shouldListenRef.current) {
              try {
                const fresh = createAndConfigureRecognition();
                if (fresh) {
                  recognitionRef.current = fresh;
                  fresh.start();
                }
              } catch (err) {
                console.warn("Speech recognition auto-restart failed:", err);
                setIsListening(false);
                shouldListenRef.current = false;
              }
            }
          }, 150);
        } else {
          setIsListening(false);
        }
      };

      return recognition;
    } catch (err) {
      console.error("Failed to construct SpeechRecognition:", err);
      return null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    setError(null);
    shouldListenRef.current = true;

    // Clean up any old instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }

    const recognition = createAndConfigureRecognition();
    if (!recognition) {
      shouldListenRef.current = false;
      setError("Could not initialize microphone recognition.");
      return;
    }

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      shouldListenRef.current = false;
      setIsListening(false);
      setError("Could not start microphone. Please try again.");
    }
  }, [createAndConfigureRecognition, isSupported]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      recognitionRef.current = null;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (shouldListenRef.current || isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup exclusively on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
};
