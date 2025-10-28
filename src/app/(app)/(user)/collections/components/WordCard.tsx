"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine, Trash2 } from "lucide-react";
import { EditWordDialog } from "./EditWordDialog";
import { DeleteWordDialog } from "./DeleteWordDialog";

interface Word {
  word: string;
  type: string;
  meaning: string;
  definitionEn: string;
  definitionVi: string;
  exampleEn: string;
  exampleVi: string;
}

interface WordCardProps {
  wordData: Word;
  onEdit: (updatedWord: Word) => void;
  onDelete: () => void;
}

export function WordCard({ wordData, onEdit, onDelete }: WordCardProps) {
  const {
    word,
    type,
    meaning,
    definitionEn,
    definitionVi,
    exampleEn,
    exampleVi,
  } = wordData;

  const typeStyles: Record<string, string> = {
    noun: "bg-[#E9EFFD] text-[#2563EB]",
    verb: "bg-[#FEE2E2] text-[#C41C1C]",
    adjective: "bg-[#F0FDF4] text-[#16A34A]",
    adverb: "bg-[#f3ecc0] text-[#C38902]",
  };

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold justify-between">
          <span className="text-3xl text-[#1D1D1D]">{word}</span>
          <span
            className={`px-2 py-0.5 rounded-md text-sm font-medium ${
              typeStyles[type] || "bg-gray-100 text-gray-600"
            }`}
          >
            {type}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-700">
        <p className="text-[18px] text-[#939393]">Vietnamese meaning:</p>
        <p className="text-black text-[16px] font-medium">{meaning}</p>
        <p className="text-[#939393] text-[18px]">Definition:</p>
        <p className="font-medium text-black text-[16px]">{definitionEn}</p>
        <p className="font-medium italic text-[#939393] text-[16px]">
          {definitionVi}
        </p>
        <p className="text-[#939393] text-[18px]">Example:</p>
        <p className="italic text-black text-[16px]">“{exampleEn}”</p>
        <p className="italic text-[#939393] text-[16px]">“{exampleVi}”</p>

        <div className="flex justify-end gap-4 pt-2">
          <EditWordDialog wordData={wordData} onSave={onEdit}>
            <PenLine
              color="#939393"
              size={20}
              className="cursor-pointer hover:text-blue-600 transition-colors"
            />
          </EditWordDialog>
          <DeleteWordDialog onConfirm={onDelete}>
            <Trash2
              color="#C30000"
              size={20}
              className="cursor-pointer hover:text-red-800 transition-colors"
            />
          </DeleteWordDialog>
        </div>
      </CardContent>
    </Card>
  );
}
