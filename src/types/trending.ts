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

export interface Vocabulary {
  word: string;
  word_vn: string;
  phonetics: {
    uk: Phonetic;
    us: Phonetic;
  };
  partOfSpeech: string;
  definition_en: string;
  definition_vi: string;
  examples: Example[];
  idioms_collocations: IdiomCollocation[];
  synonyms: string[];
  source: string;
}

export interface Article {
  src: string;
  link: string;
  title: string;
  desc: string;
  published_date: string;
  image: string;
  list_words: Vocabulary[];
  crawled_date: string;
}
