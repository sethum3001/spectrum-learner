import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";

const VirtualAssistant = () => {
  const navigation = useNavigation();

  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const [AIResponse, setAIResponse] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  //   const saveRecordingToPublicFolder = async (uri: string) => {
  //     const destinationUri = `${FileSystem.documentDirectory}recording.wav`;

  //     try {
  //       await FileSystem.copyAsync({
  //         from: uri,
  //         to: destinationUri,
  //       });

  //       const fileInfo = await FileSystem.getInfoAsync(destinationUri);
  //       console.log("File Info:", fileInfo);

  //       if (fileInfo.exists) {
  //         console.log("File successfully copied to:", destinationUri);
  //       } else {
  //         console.error("File copy failed.");
  //       }

  //       return destinationUri;
  //     } catch (error) {
  //       console.error("Error saving file:", error);
  //       return null;
  //     }
  //   };

  const getMicrophonePersmission = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();

      if (!granted) {
        alert("Permission to access microphone is required!");
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error occured while requesting permission: ", error);
      return false;
    }
  };

  const recordingOptions: any = {
    android: {
      extension: ".wav",
      outPutFormat: Audio.AndroidOutputFormat.MPEG_4,
      androidEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".wav",
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const startRecording = async () => {
    const hasPermission = await getMicrophonePersmission();
    if (!hasPermission) {
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
    } catch (error) {
      console.log("Error occured while starting recording: ", error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setLoading(true);
    try {
      await recording?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        
      });

      //   const uri = await saveRecordingToPublicFolder(
      //     recording?.getURI() as string
      //   );
      const uri = recording?.getURI();
      console.log("Recording URI:", uri);

      const transcript = await sendAudioToWhisper(uri!);
      setText(transcript);
    } catch (error) {
      console.log("Error occured while stopping recording: ", error);
    }
  };

  const sendAudioToWhisper = async (uri: string) => {
    try {
      const formData: any = new FormData();
      formData.append("audio", {
        uri,
        type: "audio/wav",
        name: "recording.wav",
      });
      formData.append("model", "whisper-1");

      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response);
      return response.data.text;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "Error occured while sending audio to whisper: ",
          error.response?.data || error.message
        );
      } else {
        console.log("Error occured while sending audio to whisper: ", error);
      }
      return "";
    }
  };

  return (
    <View className="">
      <>
        {!isRecording ? (
          <>
            {AIResponse ? (
              <View></View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={startRecording}
              >
                <FontAwesome name="microphone" size={150} color="#2b3356" />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <TouchableOpacity onPress={stopRecording}>
            <FontAwesome name="microphone" size={100} color="#2b3356" />
          </TouchableOpacity>
        )}
      </>
    </View>
  );
};

export default VirtualAssistant;
