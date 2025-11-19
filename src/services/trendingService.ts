import { Article } from "@/types/trending";

const TRENDING_API_URL =
  process.env.NEXT_PUBLIC_TRENDING_API_URL ||
  "https://ghostlier-trappier-lani.ngrok-free.dev";

export async function getTrendingArticles(date: string): Promise<Article[]> {
  const response = await fetch(`${TRENDING_API_URL}/articles/${date}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch trending articles: ${response.statusText}`
    );
  }

  return response.json();
}
