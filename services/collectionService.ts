import { ApiWord, Collection, CollectionDetail } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_CORE_SERVICE_API;
const CHATBOT_API_URL = process.env.EXPO_PUBLIC_CHATBOT_API_URL;

const getHeaders = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getUserCollections(): Promise<Collection[]> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/collections`, {
    method: "GET",
    headers,
  });
  if (!response.ok) throw new Error("Failed to fetch collections");
  const data = await response.json();
  return data.data.map((item: any) => ({
    ...item,
    wordCount: item.totalWords || item.wordCount || 0,
  }));
}

export async function getCollectionDetail(
  id: number | string
): Promise<CollectionDetail> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/collections/${id}`, {
    method: "GET",
    headers,
  });
  if (!response.ok) throw new Error("Failed to fetch collection details");
  const data = await response.json();
  const mappedWords = data.data.words.map((w: any) => ({
    ...w,
    wordText: w.wordText || w.word,
  }));

  return {
    ...data.data,
    words: mappedWords,
  };
}

export async function updateWord(
  wordId: number,
  updateData: any
): Promise<ApiWord> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/words/${wordId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("Failed to update word");
  const data = await response.json();
  return data.data;
}

export async function deleteWord(
  collectionId: number,
  wordId: number
): Promise<void> {
  const headers = await getHeaders();
  const response = await fetch(
    `${BASE_URL}/collections/${collectionId}/words/${wordId}`,
    {
      method: "DELETE",
      headers,
    }
  );
  if (!response.ok) throw new Error("Failed to delete word");
}

export async function updateCollection(
  collectionId: number,
  name: string
): Promise<void> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/collections/${collectionId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to update collection");
}

export async function deleteCollection(collectionId: number): Promise<void> {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}/collections/${collectionId}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error("Failed to delete collection");
}

export async function enrichWord(word: string): Promise<ApiWord> {
  // Không cần header Authorization cho chatbot nếu không yêu cầu
  const response = await fetch(`${CHATBOT_API_URL}/api/v1/enrich/${word}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) throw new Error("Failed to enrich word");
  const data = await response.json();

  const synonymsString = Array.isArray(data.synonyms)
    ? data.synonyms.join(", ")
    : data.synonyms || "";

  return {
    ...data,
    wordText: data.word,
    wordVn: data.word_vn,
    definitionEn: data.definition_en,
    definitionVi: data.definition_vi,
    idiomsCollocations: data.idioms_collocations,
    phrasalVerbs: data.phrasal_verbs,
    synonyms: synonymsString,
  };
}

export async function enrichWordsBulk(words: string[]): Promise<ApiWord[]> {
  const response = await fetch(`${CHATBOT_API_URL}/api/v1/enrich/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ words }),
  });

  if (!response.ok) throw new Error("Failed to enrich list of words");
  const data = await response.json();
  const results = data.results || [];

  return results.map((item: any) => ({
    ...item,
    wordText: item.word,
    wordVn: item.word_vn,
    definitionEn: item.definition_en,
    definitionVi: item.definition_vi,
    idiomsCollocations: item.idioms_collocations,
    phrasalVerbs: item.phrasal_verbs,
    synonyms: Array.isArray(item.synonyms)
      ? item.synonyms.join(", ")
      : item.synonyms || "",
  }));
}

export async function addWordsToCollection(
  collectionName: string,
  words: any[]
) {
  const headers = await getHeaders();
  const payload = {
    collection: collectionName,
    words: words.map((w) => ({
      word: w.wordText || w.word,
      word_vn: w.wordVn,
      phonetics: w.phonetics,
      partOfSpeech: w.partOfSpeech,
      definition_en: w.definitionEn,
      definition_vi: w.definitionVi,
      examples: w.examples,
      idioms_collocations: w.idiomsCollocations,
      phrasal_verbs: w.phrasalVerbs,
      synonyms:
        typeof w.synonyms === "string"
          ? w.synonyms
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0)
          : w.synonyms || [],
      source: w.sourceUrl,
    })),
  };

  const response = await fetch(`${BASE_URL}/collections/add-words`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to add words");
  return await response.json();
}

export async function createCollectionWithWords(
  collectionName: string,
  words: any[]
) {
  const headers = await getHeaders();
  const payload = {
    collection: collectionName,
    list_words: words.map((w) => ({
      word: w.wordText || w.word,
      word_vn: w.wordVn,
      phonetics: w.phonetics,
      partOfSpeech: w.partOfSpeech,
      definition_en: w.definitionEn,
      definition_vi: w.definitionVi,
      examples: w.examples,
      idioms_collocations: w.idiomsCollocations,
      phrasal_verbs: w.phrasal_verbs || w.phrasalVerbs,
      synonyms:
        typeof w.synonyms === "string"
          ? w.synonyms
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0)
          : w.synonyms || [],
      source: w.sourceUrl,
    })),
  };

  const response = await fetch(`${BASE_URL}/collections/add-word/bulk`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to create collection");
  return await response.json();
}
