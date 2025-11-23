import { ApiWord, CollectionDetail } from "@/types/collection";
import { Collection } from "@/types/dashboard";

const BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_API;
const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL;

export async function getUserCollections(): Promise<Collection[]> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/collections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }

  const data = await response.json();
  return data.data;
}

export async function getCollectionDetail(
  id: string
): Promise<CollectionDetail> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/collections/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch collection details");
  }

  const data = await response.json();
  return data.data;
}

export async function updateWord(
  wordId: number,
  updateData: any
): Promise<ApiWord> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/words/${wordId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update word");
  }

  const data = await response.json();
  return data.data;
}

export async function deleteWord(
  collectionId: number,
  wordId: number
): Promise<void> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(
    `${BASE_URL}/collections/${collectionId}/words/${wordId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete word");
  }
}

export async function updateCollection(
  collectionId: number,
  name: string
): Promise<void> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/collections/${collectionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update collection");
  }
}

export async function deleteCollection(collectionId: number): Promise<void> {
  if (!BASE_URL) throw new Error("API URL is not defined");

  const response = await fetch(`${BASE_URL}/collections/${collectionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete collection");
  }
}

export async function enrichWord(word: string): Promise<ApiWord> {
  if (!CHATBOT_API_URL) throw new Error("CHATBOT_API_URL is not defined");

  const response = await fetch(`${CHATBOT_API_URL}/api/v1/enrich/${word}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to enrich word");
  }

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

export async function addWordsToCollection(
  collectionName: string,
  words: any[]
) {
  if (!BASE_URL) throw new Error("API URL is not defined");

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
      source: w.source,
    })),
  };

  const response = await fetch(`${BASE_URL}/collections/add-words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add words");
  }

  return await response.json();
}
