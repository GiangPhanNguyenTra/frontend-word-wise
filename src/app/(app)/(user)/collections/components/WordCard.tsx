"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, Trash2, Volume2 } from "lucide-react";
import { EditWordDialog } from "./EditWordDialog";
import { DeleteWordDialog } from "./DeleteWordDialog";

interface UIWord {
  id: number;
  word: string;
  type: string;
  meaning: string;
  definitionEn: string;
  definitionVi: string;
  exampleEn: string;
  exampleVi: string;
  phoneticsUkText: string;
  phoneticsUkAudio: string;
  phoneticsUsText: string;
  phoneticsUsAudio: string;
  synonyms: string;
  idiomsCollocations: { en: string; vi: string }[];
  phrasalVerbs: { en: string; vi: string }[];
}

interface WordCardProps {
  wordData: UIWord;
  onEdit: (updatedWord: UIWord) => Promise<void>;
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
    phoneticsUkText,
    phoneticsUkAudio,
    phoneticsUsText,
    phoneticsUsAudio,
    synonyms,
    idiomsCollocations,
    phrasalVerbs,
  } = wordData;

  const playAudio = (url: string) => {
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] transition-shadow duration-300 h-full border-none">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header: Word, Type, Phonetics & Actions */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h4 className="text-2xl font-bold text-gray-900">{word}</h4>
              <span className="text-sm text-gray-500 italic">({type})</span>
            </div>

            {/* Phonetics */}
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
              {phoneticsUkText && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => playAudio(phoneticsUkAudio)}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>UK {phoneticsUkText}</span>
                </div>
              )}
              {phoneticsUsText && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => playAudio(phoneticsUsAudio)}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>US {phoneticsUsText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <EditWordDialog wordData={wordData} onSave={onEdit}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 text-gray-400"
              >
                <PenLine size={16} />
              </Button>
            </EditWordDialog>
            <DeleteWordDialog onConfirm={onDelete}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-50 hover:text-red-600 text-gray-400"
              >
                <Trash2 size={16} />
              </Button>
            </DeleteWordDialog>
          </div>
        </div>

        <div className="space-y-4 text-sm flex-grow">
          {/* Vietnamese Meaning */}
          <div>
            <p className="text-gray-600 font-semibold mb-1">
              Vietnamese meaning:
            </p>
            <p className="text-xl font-medium text-gray-900">{meaning}</p>
          </div>

          {/* Definition */}
          {(definitionEn || definitionVi) && (
            <div>
              <p className="text-gray-600 font-semibold mb-1">Definition:</p>
              {definitionEn && (
                <p className="text-gray-700 mb-1">{definitionEn}</p>
              )}
              {definitionVi && (
                <p className="text-slate-500 italic">{definitionVi}</p>
              )}
            </div>
          )}

          {/* Example */}
          {(exampleEn || exampleVi) && (
            <div>
              <p className="text-gray-600 font-semibold mb-1">Example:</p>
              {exampleEn && (
                <p className="text-gray-700 mb-1">&quot;{exampleEn}&quot;</p>
              )}
              {exampleVi && (
                <p className="text-slate-500 italic">&quot;{exampleVi}&quot;</p>
              )}
            </div>
          )}

          {/* Synonyms - Styled exactly like the "ally" card badges */}
          {synonyms && synonyms.length > 0 && (
            <div>
              <p className="text-gray-600 font-semibold mb-2">Synonyms:</p>
              <div className="flex flex-wrap gap-2">
                {synonyms.split(",").map((syn, idx) => (
                  <span
                    key={idx}
                    className="bg-[#EAB308] text-black font-medium px-3 py-1 rounded-full text-xs shadow-sm"
                  >
                    {syn.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collocations */}
          {idiomsCollocations && idiomsCollocations.length > 0 && (
            <div>
              <p className="text-gray-600 font-semibold mb-1">Collocations:</p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                {idiomsCollocations.map((item, idx) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-medium">{item.en}</span>
                    <span className="text-slate-500 italic text-xs ml-1">
                      - {item.vi}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Phrasal Verbs */}
          {phrasalVerbs && phrasalVerbs.length > 0 && (
            <div>
              <p className="text-gray-600 font-semibold mb-1">Phrasal Verbs:</p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                {phrasalVerbs.map((item, idx) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-medium">{item.en}</span>
                    <span className="text-slate-500 italic text-xs ml-1">
                      - {item.vi}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
