"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { ArticleCard } from "@/components/trending/ArticleCard";
import { DateNavigator } from "@/components/trending/DateNavigator";
import { VocabularyCard } from "@/components/trending/VocabularyCard";
import { getTrendingArticles } from "@/services/trendingService";
import { Article } from "@/types/trending";

export default function TodayPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formattedDate = format(currentDate, "yyyy-MM-dd");

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await getTrendingArticles(formattedDate);
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load trending articles.");
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [formattedDate]);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  return (
    <div className="space-y-12">
      <DateNavigator
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : !articles || articles.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No articles found for this date.
        </div>
      ) : (
        articles.map((article, index) => (
          <div key={index} className="space-y-4">
            <ArticleCard
              article={{
                imageUrl: article.image,
                title: article.title,
                description: article.desc,
                category: article.src,
                publishDate: format(
                  new Date(article.published_date),
                  "MMMM dd, yyyy"
                ),
                articleUrl: article.link,
              }}
            />
            <div className="mt-4">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Vocabulary Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                {article.list_words.map((vocab, vIndex) => (
                  <VocabularyCard key={vIndex} vocab={vocab} />
                ))}
              </div>
            </div>
            {index < articles.length - 1 && <hr className="border-gray-200" />}
          </div>
        ))
      )}
    </div>
  );
}
