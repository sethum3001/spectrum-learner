import { useState, useEffect, useCallback } from "react";
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";

interface IState {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  partialResults: string[];
  isRecording: boolean;
}

export const useVoiceRecognition = () => {
  const [state, setState] = useState<IState>({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isRecording: false,
  });

  const [isVoiceInitialized, setIsVoiceInitialized] = useState(false);

  // Reset the state
  const resetState = useCallback(() => {
    setState({
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: "",
      isRecording: false,
    });
  }, []);

  // Initialize Voice recognition
  useEffect(() => {
    const initializeVoice = async () => {
      try {
        // Check if Voice is already initialized
        if (!isVoiceInitialized) {
          await Voice.destroy(); // Ensure Voice is clean before initializing
          await Voice.removeAllListeners(); // Remove any existing listeners
          setIsVoiceInitialized(true); // Mark Voice as initialized
          console.log("Voice initialized successfully.");
        }
      } catch (e) {
        console.error("Failed to initialize Voice:", e);
        setIsVoiceInitialized(false); // Mark Voice as not initialized
      }
    };

    initializeVoice();

    // Cleanup function
    return () => {
      Voice.destroy()
        .then(() => Voice.removeAllListeners())
        .catch((e) => console.error("Cleanup error:", e));
    };
  }, [isVoiceInitialized]);

  // Start recognizing speech
  const startRecognizing = useCallback(async () => {
    if (!isVoiceInitialized) {
      console.warn("Voice is not initialized.");
      return;
    }

    resetState();
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setState((prevState) => ({ ...prevState, error: "Failed to start recognition" }));
    }
  }, [isVoiceInitialized, resetState]);

  // Stop recognizing speech
  const stopRecognizing = useCallback(async () => {
    if (!isVoiceInitialized) {
      console.warn("Voice is not initialized.");
      return;
    }

    try {
      await Voice.stop();
    } catch (e) {
      console.error("Failed to stop recognition:", e);
      setState((prevState) => ({ ...prevState, error: "Failed to stop recognition" }));
    }
  }, [isVoiceInitialized]);

  // Cancel recognizing speech
  const cancelRecognizing = useCallback(async () => {
    if (!isVoiceInitialized) {
      console.warn("Voice is not initialized.");
      return;
    }

    try {
      await Voice.cancel();
    } catch (e) {
      console.error("Failed to cancel recognition:", e);
      setState((prevState) => ({ ...prevState, error: "Failed to cancel recognition" }));
    }
  }, [isVoiceInitialized]);

  // Destroy the recognizer
  const destroyRecognizer = useCallback(async () => {
    if (!isVoiceInitialized) {
      console.warn("Voice is not initialized.");
      return;
    }

    try {
      await Voice.destroy();
      resetState();
    } catch (e) {
      console.error("Failed to destroy recognizer:", e);
      setState((prevState) => ({ ...prevState, error: "Failed to destroy recognizer" }));
    }
  }, [isVoiceInitialized, resetState]);

  // Set up event listeners
  useEffect(() => {
    if (!isVoiceInitialized) return;

    Voice.onSpeechStart = (e: any) => {
      setState((prevState) => ({
        ...prevState,
        started: "√",
        isRecording: true,
      }));
    };

    Voice.onSpeechRecognized = () => {
      setState((prevState) => ({ ...prevState, recognized: "√" }));
    };

    Voice.onSpeechEnd = (e: any) => {
      setState((prevState) => ({ ...prevState, end: "√", isRecording: false }));
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setState((prevState) => ({
        ...prevState,
        error: JSON.stringify(e.error),
        isRecording: false,
      }));
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, results: e.value! }));
      }
    };

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, partialResults: e.value! }));
      }
    };

    Voice.onSpeechVolumeChanged = (e: any) => {
      setState((prevState) => ({ ...prevState, pitch: e.value }));
    };

    // Cleanup listeners
    return () => {
      Voice.destroy()
        .then(() => Voice.removeAllListeners())
        .catch((e) => console.error("Listener cleanup error:", e));
    };
  }, [isVoiceInitialized]);

  return {
    state,
    setState,
    resetState,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizer,
  };
};