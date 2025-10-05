import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { Audio } from "expo-av";
import { router } from "expo-router";
import { AudioLines, Mic } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import AngryIcon from "@/assets/images/angry.svg";

export default function DiaryNextScreen() {
  const [tags, setTags] = useState<{ tag_id: string; tag_name: string }[]>([]);
  const [thoughts, setThoughts] = useState<string>("");

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [recording]);

  const pulseStyle = {
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
      },
    ],
    opacity: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission required", "Microphone access is needed");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri ?? null);
    setRecording(null);

    // reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
  };

  const playRecording = async () => {
    if (!audioUri) return;

    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    await sound.playAsync();
  };

  // clear khi unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleSave = async () => {
    if (!thoughts) {
      Alert.alert("Error", "Please fill in required fields");
      return;
    }

    const formData = new FormData();
    formData.append("text_content", thoughts);
    formData.append("tags", JSON.stringify(tags));

    if (audioUri) {
      formData.append("audio", {
        uri: audioUri,
        name: "recording.m4a",
        type: "audio/m4a",
      } as any);
    }

    try {
      const res = await fetch("https://your-api-url.com/diary", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save diary");
      Alert.alert("Success", "Diary saved!");
      router.push("/(tabs)/home/diary");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save diary");
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Diary" />

      <ScrollView
        className="flex-1 mt-8 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="gap-6 items-center">
          <Text className="text-black text-3xl text-center font-[Poppins-Bold]">
            How are you feeling?
          </Text>
          <AngryIcon width={100} height={100} />

          {/* Thoughts */}
          <TextInput
            value={thoughts}
            onChangeText={setThoughts}
            className="p-4 text-black text-base font-[Poppins-Italic] text-center"
            placeholder="What are you thinking..."
            placeholderTextColor="#AEA8A5"
            multiline
            numberOfLines={9}
            textAlignVertical="top"
          />

          {/* Tags */}
          <View className="space-y-2">
            <View className="flex-row flex-wrap gap-2 mt-2">
              <TagSelector
                options={[
                  { id: "1", name: "Family" },
                  { id: "2", name: "Work" },
                  { id: "3", name: "Study" },
                ]}
                multiSelect={true}
                onChange={(id, selected) => {
                  const arr = Array.isArray(selected)
                    ? selected
                    : selected
                    ? [selected]
                    : [];
                  setTags(
                    arr.map((s) => ({ tag_id: String(s.id), tag_name: s.name }))
                  ); // ép về string
                }}
              />
            </View>
          </View>

          {/* Recorder */}
          <View className="items-center">
            <View className="w-[120px] h-[120px] items-center justify-center">
              {recording && (
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: "#7F56D9",
                    },
                    pulseStyle,
                  ]}
                />
              )}

              <TouchableOpacity
                className="w-[80px] h-[80px] rounded-full items-center justify-center"
                onPress={recording ? stopRecording : startRecording}
              >
                <Mic
                  width={40}
                  height={40}
                  color={recording ? "#7F56D9" : "#A894C1"}
                />
              </TouchableOpacity>
            </View>

            <Text className="text-black font-[Poppins-SemiBold] text-sm tracking-wide mt-2">
              {recording ? "Stop Recording" : "Start Recording"}
            </Text>

            {audioUri && !recording && (
              <TouchableOpacity
                className="h-[60px] px-6 rounded-lg flex-row items-center justify-center gap-2 mt-3"
                onPress={playRecording}
              >
                <AudioLines width={30} height={30} color="#4ADE80" />
                <Text className="text-black font-[Poppins-SemiBold] text-sm tracking-wide">
                  Play Recording
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Save button */}
          <TouchableOpacity
            disabled={!thoughts}
            className={`w-full h-16 rounded-xl items-center justify-center ${
              !thoughts ? "opacity-40 bg-[#7F56D9]" : "bg-[#7F56D9]"
            }`}
            onPress={handleSave}
          >
            <Text className="text-white font-[Poppins-Bold] text-lg tracking-wide">
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}