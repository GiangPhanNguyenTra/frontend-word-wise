import { ArticleCard } from "@/components/trending/ArticleCard";
import { DateNavigator } from "@/components/trending/DateNavigator";
import { VocabularyCard } from "@/components/trending/VocabularyCard";

const mockArticle = {
  imageUrl: "http://static.photos/technology/640x360/1",
  title: "Tech Giant Unveils Revolutionary AI Assistant",
  description:
    "The new AI system can understand and respond to complex queries with human-like accuracy, marking a significant leap in natural language processing technology.",
  category: "VTV",
  publishDate: "June 14, 2023",
  articleUrl:
    "https://freshertube.com/tech-giant-unveils-revolutionary-ai-powered-device/",
};

const mockVocabulary = {
  word: "Revolutionary",
  vietnameseMeaning: "cách mạng, đột phá",
  definition: {
    en: "involving or causing a complete or dramatic change",
    vi: "liên quan hoặc gây ra sự thay đổi hoàn toàn hoặc đáng kể",
  },
  example: {
    en: "This new drug is revolutionary in its approach to treating cancer.",
    vi: "Loại thuốc mới này mang tính đột phá trong cách điều trị ung thư.",
  },
};

const vocabularyList = Array(6).fill(mockVocabulary);

export default function TodayPage() {
  return (
    <div className="space-y-12">
      <DateNavigator />
      <ArticleCard article={mockArticle} />
      <div className="mt-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Vocabulary Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {vocabularyList.map((vocab, index) => (
            <VocabularyCard key={index} vocab={vocab} />
          ))}
        </div>
      </div>
    </div>
  );
}
