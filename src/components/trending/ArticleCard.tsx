import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowUpRight } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho bài báo
type ArticleProps = {
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  publishDate: string;
  articleUrl: string;
};

export const ArticleCard = ({ article }: { article: ArticleProps }) => {
  return (
    <Card className="overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] shadow-xl transition-shadow duration-300">
      <div className="grid md:grid-cols-3">
        <div className="md:col-span-1">
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={400}
            height={300}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-gray-800">
                {article.title}
              </h3>
              <Badge
                variant="secondary"
                className=" !text-[var(--color-success)] !bg-[#00966D19] "
              >
                {article.category}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">{article.description}</p>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">
                Published: {article.publishDate}
              </span>
              <span className="sm:hidden">{article.publishDate}</span>
            </div>
            <Link
              href={article.articleUrl}
              target="_blank"
              className="flex items-center gap-1 text-primary hover:underline whitespace-nowrap"
            >
              Read full article
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
