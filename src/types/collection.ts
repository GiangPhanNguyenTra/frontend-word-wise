export interface Phonetic {
  text: string;
  audio: string;
}

export interface Example {
  en: string;
  vi: string;
}

export interface IdiomCollocation {
  en: string;
  vi: string;
}

export interface PhrasalVerb {
  en: string;
  vi: string;
}

export interface ApiWord {
  wordId: number;
  wordText: string;
  wordVn: string;
  partOfSpeech: string;
  definitionEn: string;
  definitionVi: string;
  sourceUrl: string;
  phonetics: {
    uk: Phonetic;
    us: Phonetic;
  };
  examples: Example[];
  idiomsCollocations: IdiomCollocation[];
  phrasalVerbs: PhrasalVerb[] | null;
  synonyms: string;
}

export interface CollectionDetail {
  collectionId: number;
  name: string;
  description: string | null;
  totalWords: number;
  createdAt: string;
  lastStudiedAt: string | null;
  words: ApiWord[];
}
