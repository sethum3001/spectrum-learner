import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import useWebFocus from "@/hooks/useWebFocus";
import { recordSpeech } from "./functions/recordSpeech";
import { transcribeSpeech } from "./functions/transcribeSpeech";

// Import your Lottie JSON files
import micOnAnimation from "./../../../assets/animations/Animation - 1742404403182.json";
import micOffAnimation from "./../../../assets/animations/Animation - 1742404496205.json";
import React from "react";

export default function HomeScreen() {
  const [transcribedSpeech, setTranscribedSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const isWebFocused = useWebFocus();
  const audioRecordingRef = useRef(new Audio.Recording());
  const webAudioPermissionsRef = useRef<MediaStream | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  const playTranscribedText = () => {
    if (transcribedSpeech) {
      Speech.speak(transcribedSpeech, {
        language: "en",
        pitch: 1.0,
        rate: 1.0,
      });
    } else {
      console.log("No transcribed text to play.");
    }
  };

  useEffect(() => {
    if (transcribedSpeech) {
      playTranscribedText();
    }
  }, [transcribedSpeech]);

  useEffect(() => {
    if (isWebFocused) {
      const getMicAccess = async () => {
        const permissions = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        webAudioPermissionsRef.current = permissions;
      };
      if (!webAudioPermissionsRef.current) getMicAccess();
    } else {
      if (webAudioPermissionsRef.current) {
        webAudioPermissionsRef.current
          .getTracks()
          .forEach((track) => track.stop());
        webAudioPermissionsRef.current = null;
      }
    }
  }, [isWebFocused]);

  const startRecording = async () => {
    setIsRecording(true);
    await recordSpeech(
      audioRecordingRef,
      setIsRecording,
      !!webAudioPermissionsRef.current
    );
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      const result = await transcribeSpeech(audioRecordingRef);
      const mainResponse = result?.mainResponse || "";
      const followUpQuestions = result?.followUpQuestions || [];
      setTranscribedSpeech(mainResponse);
      setFollowUpQuestions(followUpQuestions); // Set follow-up questions
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFollowUpQuestionClick = async (question: string) => {
    setIsProcessingQuestion(true);
    try {
      const serverUrl = `https://virtual-assistant-spectrum-learner-production.up.railway.app`;
      const response = await fetch(`${serverUrl}/process-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: question }),
      });

      const data = await response.json();
      console.log(data);
      setTranscribedSpeech(data.main_response);
      setFollowUpQuestions(data.follow_up_questions || []);
    } catch (error) {
      console.error("Error processing follow-up question:", error);
    } finally {
      setIsProcessingQuestion(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#90EE90"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Lottie Animation */}
          <LottieView
            source={isRecording ? micOnAnimation : micOffAnimation}
            style={styles.lottieAnimation}
            autoPlay
            loop
          />

          {/* Transcription Box */}
          <View style={styles.transcriptionContainer}>
            <ScrollView>
              {isTranscribing ? (
                <ActivityIndicator size="small" color="#6C9BCF" />
              ) : (
                <>
                  {/* Main Response */}
                  <Text style={styles.transcribedText}>
                    {transcribedSpeech ||
                      "Your transcribed text will be shown here"}
                  </Text>

                  {/* Follow-Up Questions */}
                  {followUpQuestions.length > 0 && (
                    <View style={styles.followUpContainer}>
                      <Text style={styles.followUpTitle}>
                        Follow-Up Questions:
                      </Text>
                      <TouchableOpacity
                        style={styles.followUpQuestion}
                        onPress={() =>
                          handleFollowUpQuestionClick(followUpQuestions[0])
                        }
                        disabled={isProcessingQuestion}
                      >
                        <Text style={styles.followUpText}>
                          {isProcessingQuestion
                            ? "Processing..."
                            : followUpQuestions[0]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
            {/* Play Button */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={playTranscribedText}
              disabled={!transcribedSpeech || isTranscribing}
            >
              <FontAwesome name="volume-up" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Microphone Button */}
          <TouchableOpacity
            style={[
              styles.microphoneButton,
              (isRecording || isTranscribing) && styles.disabledButton,
            ]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
            disabled={isRecording || isTranscribing}
          >
            {isRecording ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <FontAwesome name="microphone" size={40} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  transcriptionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "90%",
    height: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  transcribedText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    fontFamily: "Nunito-Regular",
  },
  playButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#6C9BCF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  microphoneButton: {
    backgroundColor: "#FF6B6B",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  followUpContainer: {
    marginTop: 20,
    width: "100%",
  },
  followUpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C9BCF",
    marginBottom: 10,
  },
  followUpQuestion: {
    backgroundColor: "rgba(108, 155, 207, 0.1)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  followUpText: {
    fontSize: 16,
    color: "#555",
    textAlign: "left",
    fontFamily: "Nunito-Regular",
    marginBottom: 10,
  },
});
