export interface ChatSource {
  document_title: string;
  section_title: string;
  content: string;
  source: string;
  chunk_id: number;
  score: number;
}

export interface ChatSuggestedAction {
  label: string;
  type: "open_url" | "copy" | string;
  url?: string;
}

export interface ChatPayloadDetail {
  answer_en: string;
  answer_vi: string;
  detail: string;
  confidence: number;
  sources: ChatSource[];
  suggested_actions: ChatSuggestedAction[];
}

export interface ChatResponse {
  status: string;
  session_id: string;
  type: "result" | "confirm" | "error";
  intent: "app_question" | "add_word" | "create_collection" | "other";
  payload: ChatPayloadDetail;
  message: string;
}
