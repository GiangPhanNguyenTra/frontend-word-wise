import Heading from "@/components/Heading";
import ProgressCard from "@/components/ProgressCard";
import PronunciationCard from "@/components/PronunciationCard";
import { getCollectionDetail } from "@/services/collectionService";
import {
  checkPronunciation,
  getExampleWords,
  savePronunciationResult,
} from "@/services/pronunciationService";
import { startRecording, stopRecording } from "@/utils/recorder";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Frown, Laugh, Mic, RotateCw, Square } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import Toast from "react-native-toast-message";

// Import sounds
const SoundGood = require("@/assets/sounds/good.wav");
const SoundOkay = require("@/assets/sounds/okay.wav");
const SoundBad = require("@/assets/sounds/bad.wav");

export default function PracticeWordScreen() {
  const router = useRouter();
  // Nhận params từ trang index (type, limit, collectionName)
  const { type, limit, collectionName } = useLocalSearchParams<{
    type?: string;
    limit?: string;
    collectionName?: string;
  }>();

  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [result, setResult] = useState<any>(null);
  const [userAudioUri, setUserAudioUri] = useState<string | null>(null);
  const [sessionResults, setSessionResults] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        let wordsData: any[] = [];

        if (type === "collection" && collectionName) {
          // Trường hợp 1: Lấy từ Collection
          const detail = await getCollectionDetail(collectionName);
          // Map từ vựng Collection sang format chuẩn cho Pronunciation
          // Collection trả về: { wordText: "Hello", phonetics: { us: { text: "..." } } }
          // Format cần: { id, text, ipa }
          wordsData = detail.words.map((w, idx) => ({
            id: w.wordId?.toString() || Math.random().toString(),
            text: w.wordText,
            ipa: w.phonetics?.us?.text || w.phonetics?.uk?.text || "",
          }));
        } else {
          // Trường hợp 2: Random (Mặc định)
          const count = limit ? parseInt(limit, 10) : 5; // Mặc định 5 nếu không có limit
          const data = await getExampleWords(count);

          // API getExampleWords trả về: { real_transcript: ["word"], ipa_transcript: "..." }
          wordsData = data.map((item, idx) => ({
            id: Math.random().toString(),
            text: item.real_transcript[0],
            ipa: item.ipa_transcript,
          }));
        }

        if (wordsData.length === 0) {
          Toast.show({
            type: "error",
            text1: "Empty",
            text2: "No words found to practice",
          });
          router.back();
          return;
        }

        setQueue(wordsData);
      } catch (error) {
        console.error("Init Error:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load words",
        });
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const playFeedbackSound = async (score: number) => {
    try {
      let soundFile;
      if (score >= 80) soundFile = SoundGood;
      else if (score >= 50) soundFile = SoundOkay;
      else soundFile = SoundBad;

      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
    } catch (e) {
      // Ignore sound error
    }
  };

  const handleRecordToggle = async () => {
    if (recording) {
      setIsProcessing(true);
      try {
        const base64 = await stopRecording(recording);
        const uri = recording.getURI();
        setUserAudioUri(uri);
        setRecording(null);

        if (base64 && currentItem) {
          const aiResult = await checkPronunciation(currentItem.text, base64);
          setResult(aiResult);

          const score = parseFloat(aiResult.pronunciation_accuracy);
          playFeedbackSound(score);
        }
      } catch (error) {
        Toast.show({ type: "error", text1: "Error", text2: "Analysis failed" });
      } finally {
        setIsProcessing(false);
      }
    } else {
      setResult(null);
      setUserAudioUri(null);
      const newRec = await startRecording();
      if (newRec) setRecording(newRec);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setUserAudioUri(null);
  };

  const handleNext = () => {
    // Lưu kết quả khi bấm Next
    if (result && currentItem) {
      setSessionResults((prev) => [
        ...prev,
        {
          sentenceId: currentItem.id,
          userAudioUrl: "temp_base64",
          score: parseFloat(result.pronunciation_accuracy),
          feedback: {
            overall:
              parseFloat(result.pronunciation_accuracy) > 80
                ? "Good job!"
                : "Try again",
            problemSounds: [],
            missedWords: [],
          },
        },
      ]);
    }

    setResult(null);
    setUserAudioUri(null);

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    setIsLoading(true);
    try {
      const totalScore = sessionResults.reduce((sum, r) => sum + r.score, 0);
      const avgScore =
        sessionResults.length > 0 ? totalScore / sessionResults.length : 0;

      await savePronunciationResult({
        session_summary: {
          totalSentences: queue.length,
          completed: sessionResults.length,
          avgScore: Math.round(avgScore),
        },
        results: sessionResults,
      });

      router.replace({
        pathname: "/(tabs)/speak/word/result",
        params: {
          accuracy: Math.round(avgScore).toString(),
          total: queue.length.toString(),
          correct: sessionResults
            .filter((r) => r.score >= 70)
            .length.toString(),
        },
      });
    } catch (error) {
      router.replace("/(tabs)/speak");
    }
  };

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  const currentItem = queue[currentIndex];
  if (!currentItem) return null;

  const analysisData = result
    ? {
        words: result.real_transcripts.split(" "),
        scores: result.pair_accuracy_category.split(" "),
        is_letter_correct_all_words: result.is_letter_correct_all_words, // Truyền xuống để tô màu từng ký tự
      }
    : undefined;

  const score = result
    ? Math.round(parseFloat(result.pronunciation_accuracy))
    : 0;

  let statusColor = "#DC2626";
  let bgStatus = "bg-[#FEE2E2]";
  let statusText = "Needs Improvement";
  let statusMessage = "Try to articulate more clearly.";
  let IconStatus = Frown;

  if (score >= 80) {
    statusColor = "#16A34A";
    bgStatus = "bg-[#D5FFD9]";
    statusText = "Excellent!";
    statusMessage = "You sound like a native speaker.";
    IconStatus = Laugh;
  } else if (score >= 50) {
    statusColor = "#EAB308";
    bgStatus = "bg-[#FEF3C7]";
    statusText = "Not Bad!";
    statusMessage = "You are getting there, keep practicing.";
    IconStatus = Laugh;
  }

  return (
    <View className="flex-1 bg-[#F6F6F6] px-4">
      <Heading title={`Word ${currentIndex + 1}/${queue.length}`} />

      <View className="mt-4 mb-6">
        <Progress.Bar
          progress={(currentIndex + 1) / queue.length}
          width={null}
          color="#2563EB"
          unfilledColor="#E5E7EB"
          borderWidth={0}
          height={6}
        />
      </View>

      <View className="flex-1">
        <PronunciationCard
          text={currentItem.text}
          ipa={currentItem.ipa}
          userIpa={result?.ipa_transcript}
          userAudioUri={userAudioUri}
          analysis={analysisData}
        />

        {result && (
          <View
            className={`w-full rounded-[24px] px-6 py-5 mt-6 flex-row items-center justify-between ${bgStatus}`}
          >
            <View className="flex-row items-center gap-4 flex-1">
              <IconStatus color={statusColor} size={40} />
              <View className="flex-1">
                <Text
                  className={`text-lg font-[Montserrat-Bold]`}
                  style={{ color: statusColor }}
                >
                  {statusText}
                </Text>
                <Text
                  className="text-gray-600 text-xs font-[Montserrat-Medium] mt-1"
                  style={{ flexWrap: "wrap" }}
                >
                  {statusMessage}
                </Text>
              </View>
            </View>

            <View>
              <ProgressCard compact percent={score} color={statusColor} />
            </View>
          </View>
        )}
      </View>

      <View className="pb-10">
        {!result ? (
          <View className="items-center">
            <Text className="text-gray-400 mb-4 font-[Montserrat-Medium]">
              {recording ? "Recording..." : "Press and Hold to talk"}
            </Text>
            <TouchableOpacity
              onPress={handleRecordToggle}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full items-center justify-center shadow-lg border-[6px] border-white ${
                recording ? "bg-red-500" : "bg-[#2563EB]"
              }`}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : recording ? (
                <Square size={32} color="white" fill="white" />
              ) : (
                <Mic size={32} color="white" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-col gap-4">
            <TouchableOpacity
              onPress={handleNext}
              className="w-full bg-[#2563EB] h-14 rounded-full items-center justify-center shadow-lg shadow-blue-200"
            >
              <Text className="text-white font-[Montserrat-Bold] text-lg">
                Next Word
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRetry}
              className="w-full h-14 flex-row items-center justify-center gap-2"
            >
              <RotateCw size={18} color="#9CA3AF" />
              <Text className="text-gray-500 font-[Montserrat-Bold] text-base">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
