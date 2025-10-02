// data/word-data.ts

export interface WordCollection {
  id: number
  title: string
  words: string[]
  lastStudied: string
}

export const wordCollections: WordCollection[] = [
  {
    id: 1,
    title: "Technology",
    words: [
      "algorithm", "binary", "cache", "compiler", "data",
      "encryption", "firewall", "gateway", "hardware", "internet",
      "kernel", "latency", "malware", "network", "protocol",
      "query", "router", "server", "thread", "virtualization",
    ],
    lastStudied: "2d ago",
  },
  {
    id: 2,
    title: "Business",
    words: [
      "account", "balance", "capital", "debt", "equity",
      "fund", "growth", "investment", "loan", "market",
      "negotiation", "opportunity", "profit", "revenue", "strategy",
      "tax", "transaction", "valuation", "venture", "yield",
    ],
    lastStudied: "1d ago",
  },
]
