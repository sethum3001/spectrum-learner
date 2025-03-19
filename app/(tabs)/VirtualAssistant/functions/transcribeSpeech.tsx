import { Audio } from "expo-av";
import { MutableRefObject } from "react";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { readBlobAsBase64 } from "./readBlobAsBase64";

export const transcribeSpeech = async (
  audioRecordingRef: MutableRefObject<Audio.Recording>
) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });

    const isPrepared = audioRecordingRef?.current?._canRecord;
    if (isPrepared) {
      await audioRecordingRef?.current?.stopAndUnloadAsync();
      const recordingUri = audioRecordingRef?.current?.getURI() || "";

      // Create a directory for saving audio files if it doesn't exist
      const audioDir = `${FileSystem.documentDirectory}audio_recordings/`;
      const dirInfo = await FileSystem.getInfoAsync(audioDir);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
      }

      // Generate unique filename with timestamp
      const timestamp = new Date().getTime();
      const fileExtension =
        Platform.OS === "web"
          ? "webm"
          : Platform.OS === "android"
          ? "amr"
          : "wav";
      const savedFilePath = `${audioDir}recording_${timestamp}.${fileExtension}`;

      // Handle different platforms for saving the file
      if (Platform.OS === "web") {
        const blob = await fetch(recordingUri).then((res) => res.blob());
        const foundBase64 = (await readBlobAsBase64(blob)) as string;
        // Example: data:audio/wav;base64,asdjfioasjdfoaipsjdf
        const removedPrefixBase64 = foundBase64.split("base64,")[1];

        // Save the base64 data to a file
        await FileSystem.writeAsStringAsync(
          savedFilePath,
          removedPrefixBase64,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        const base64Uri = removedPrefixBase64;
      } else {
        // For native platforms, copy the file
        await FileSystem.copyAsync({
          from: recordingUri,
          to: savedFilePath,
        });

        // Read the saved file as base64
        const base64Uri = await FileSystem.readAsStringAsync(savedFilePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // Read the saved file to get base64 data
      let base64Uri;
      if (Platform.OS === "web") {
        const blob = await fetch(recordingUri).then((res) => res.blob());
        const foundBase64 = (await readBlobAsBase64(blob)) as string;
        base64Uri = foundBase64.split("base64,")[1];
      } else {
        base64Uri = await FileSystem.readAsStringAsync(savedFilePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const dataUrl = base64Uri;

      // Log the saved file path for debugging
      console.log(
        `Full audio path: ${FileSystem.documentDirectory}audio_recordings/recording_${timestamp}.${fileExtension}`
      );

      // Reset the audio recording instance
      audioRecordingRef.current = new Audio.Recording();

      const audioConfig = {
        encoding:
          Platform.OS === "android"
            ? "AMR_WB"
            : Platform.OS === "web"
            ? "WEBM_OPUS"
            : "LINEAR16",
        sampleRateHertz:
          Platform.OS === "android"
            ? 16000
            : Platform.OS === "web"
            ? 48000
            : 41000,
        languageCode: "en-US",
      };

      if (recordingUri && dataUrl) {
        const rootOrigin =
          Platform.OS === "android"
            ? "10.0.2.2"
            : Device.isDevice
            ? process.env.LOCAL_DEV_IP || "localhost"
            : "localhost";
        const serverUrl = `http://${rootOrigin}:4000`;

        const serverResponse = await fetch(`${serverUrl}/speech-to-text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioUrl: dataUrl,
            config: audioConfig,
            savedFilePath: savedFilePath, // Optionally send the path to the backend
          }),
        })
          .then((res) => res.json())
          .catch((e: Error) => console.error(e));

        const results = serverResponse?.results;
        if (results) {
          const transcript = results?.[0].alternatives?.[0].transcript;
          if (!transcript) return undefined;
          return transcript;
        } else {
          console.error("No transcript found");
          return undefined;
        }
      }
    } else {
      console.error("Recording must be prepared prior to unloading");
      return undefined;
    }
  } catch (e) {
    console.error("Failed to transcribe speech!", e);
    return undefined;
  }
};
