import Heading from "@/components/Heading";
import { ScrollView, Text, View } from "react-native";

export default function TipScreen() {
    return(
        <View className="flex-1 bg-[#F6F6F6]">
            <Heading title="Tips for Better Pronunciation" />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="mt-4 px-6">
                    <Text className="text-center font-[Montserrat-Bold] text-xl mb-2">Why pronunciation matters</Text>
                    <Text className="text-center font-[Montserrat-Medium] text-[#939393] mb-6">Practice words and sentences to improve your speaking skills.</Text>

                    <View className="bg-white rounded-[16px] p-6 mb-6">
                        <Text className="text-lg mb-1 font-[Montserrat-Bold]">1. Listen & Transcribe</Text>
                        <View className="mb-4 ml-4">
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Choose a short clip (song, movie, audio).
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Write down the words you hear.
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Replay slowly if needed (0.75× or 0.5×).
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Compare with the original.
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular]">
                                • Imitate the sounds until you can say them smoothly.
                            </Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-[16px] p-6 mb-6">
                        <Text className="text-lg mb-1 font-[Montserrat-Bold]">2. Speak & Check</Text>
                        <View className="mb-4 ml-4">
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Say the word or phrase and use a dictation app to transcribe it.
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • If it’s written correctly, your pronunciation is clear.
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Otherwise, note which words were misunderstood and work on them.
                            </Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-[16px] p-6 mb-6">
                        <Text className="text-lg mb-1 font-[Montserrat-Bold]">3. Record Yourself</Text>
                        <View className="mb-4 ml-4">
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Pick a few sentences and record your voice.
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Listen back and ask:
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1 ml-8">
                                • Are any sounds unclear?
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1 ml-8">
                                • Is it too fast or too slow?
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular]">
                                • Try replicating sentences you listened to before to compare.
                            </Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-[16px] p-6 mb-6">
                        <Text className="text-lg mb-1 font-[Montserrat-Bold]">4. Learn Phonetic Symbols</Text>
                        <View className="mb-4 ml-4">
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • English has 26 letters but 40+ sounds.
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Phonetic symbols (like /ɪ/, /ʌ/) help you see precise pronunciation.
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Knowing symbols helps you pinpoint exact sounds you need to practice.
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular]">
                                • Most dictionaries include phonetic transcriptions.
                            </Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-[16px] p-6 mb-6">
                        <Text className="text-lg mb-1 font-[Montserrat-Bold]">5. Focus on Confusing Sounds</Text>
                        <View className="mb-4 ml-4">
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1">
                                • Some sounds are easily mixed up. Focus on those. Examples:
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1 ml-8">
                                • Long vs. short vowels (e.g. leave /iː/ vs live /ɪ/)
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1 ml-8">
                                • /r/ vs /l/ (e.g. correct /r/ vs collect /l/)
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular] mb-1 ml-8">
                                • Consonant clusters (e.g. clothes often mis-pronounced)
                            </Text>
                            <Text className="text-[#696674] font-[Montserrat-Regular]">
                                • When practicing, make a note of these tricky sounds and spend extra time on them.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}