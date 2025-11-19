"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash, Volume2 } from "lucide-react";
import { Vocabulary } from "@/types/trending";

export const VocabularyCard = ({ vocab }: { vocab: Vocabulary }) => {
  const playAudio = (url: string) => {
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] transition-shadow duration-300 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {vocab.word}
              <span className="text-sm font-normal text-muted-foreground italic">
                ({vocab.partOfSpeech})
              </span>
            </h4>

            {/* Phonetics & Audio */}
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
              {vocab.phonetics?.uk && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => playAudio(vocab.phonetics.uk.audio)}
                >
                  <Volume2 className="h-3 w-3" />
                  <span>UK {vocab.phonetics.uk.text}</span>
                </div>
              )}
              {vocab.phonetics?.us && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => playAudio(vocab.phonetics.us.audio)}
                >
                  <Volume2 className="h-3 w-3" />
                  <span>US {vocab.phonetics.us.text}</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-primary group shrink-0"
          >
            <ArrowBigDownDash className="h-5 w-5 text-primary group-hover:text-white" />
          </Button>
        </div>

        <div className="space-y-3 text-sm flex-grow mt-2">
          {/* Meaning */}
          <div>
            <p className="font-semibold text-gray-600">Vietnamese meaning:</p>
            <p className="text-lg font-medium text-gray-800">{vocab.word_vn}</p>
          </div>

          {/* Definition */}
          <div>
            <p className="font-semibold text-gray-600">Definition:</p>
            <p className="text-gray-700">{vocab.definition_en}</p>
            <p className="text-muted-foreground italic mt-1">
              {vocab.definition_vi}
            </p>
          </div>

          {/* Examples */}
          {vocab.examples && vocab.examples.length > 0 && (
            <div>
              <p className="font-semibold text-gray-600">Example:</p>
              <p className="text-gray-700 font-medium">
                &quot;{vocab.examples[0].en}&quot;
              </p>
              <p className="text-muted-foreground italic">
                &quot;{vocab.examples[0].vi}&quot;
              </p>
            </div>
          )}

          {/* Synonyms */}
          {vocab.synonyms && vocab.synonyms.length > 0 && (
            <div>
              <p className="font-semibold text-gray-600 mb-1">Synonyms:</p>
              <div className="flex flex-wrap gap-1">
                {vocab.synonyms.slice(0, 5).map((syn, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Idioms / Collocations */}
          {vocab.idioms_collocations &&
            vocab.idioms_collocations.length > 0 && (
              <div>
                <p className="font-semibold text-gray-600 mb-1">
                  Collocations:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {vocab.idioms_collocations.slice(0, 2).map((idiom, idx) => (
                    <li key={idx} className="text-gray-700">
                      <span className="font-medium">{idiom.en}</span>
                      <span className="text-muted-foreground italic text-xs ml-1">
                        - {idiom.vi}
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
};
