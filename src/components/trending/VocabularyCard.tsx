"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowBigDownDash, Volume2, Loader2, Check, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Vocabulary } from "@/types/trending";
import {
  getUserCollections,
  addWordsToCollection,
} from "@/services/collectionService";
import { Collection } from "@/types/dashboard";

export const VocabularyCard = ({ vocab }: { vocab: Vocabulary }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [selectedCollectionNames, setSelectedCollectionNames] = useState<
    string[]
  >([]);

  const playAudio = (url: string) => {
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  const fetchCollections = async () => {
    setIsLoadingCollections(true);
    try {
      const data = await getUserCollections();
      setUserCollections(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load collections");
    } finally {
      setIsLoadingCollections(false);
    }
  };

  const handleOpenDialog = (open: boolean) => {
    setIsDialogOpen(open);
    if (open && userCollections.length === 0) {
      fetchCollections();
    }
  };

  const toggleCollectionSelection = (name: string) => {
    setSelectedCollectionNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleAddCollection = () => {
    if (
      newCollectionName.trim() &&
      !userCollections.find((c) => c.name === newCollectionName)
    ) {
      setSelectedCollectionNames((prev) => [...prev, newCollectionName]);

      const newCol: Collection = {
        id: Date.now(),
        name: newCollectionName,
        wordCount: 0,
        lastStudied: "",
      };

      setUserCollections((prev) => [...prev, newCol]);
      setNewCollectionName("");
    }
  };

  const handleSave = async () => {
    if (selectedCollectionNames.length === 0) {
      toast.error("Please select at least one collection");
      return;
    }

    setIsSaving(true);
    try {
      const wordPayload = {
        word: vocab.word,
        wordVn: vocab.word_vn,
        phonetics: vocab.phonetics,
        partOfSpeech: vocab.partOfSpeech,
        definitionEn: vocab.definition_en,
        definitionVi: vocab.definition_vi,
        examples: vocab.examples,
        idiomsCollocations: vocab.idioms_collocations,
        synonyms: Array.isArray(vocab.synonyms)
          ? vocab.synonyms.join(", ")
          : vocab.synonyms,
        source: vocab.source,
      };

      const promises = selectedCollectionNames.map((colName) =>
        addWordsToCollection(colName, [wordPayload])
      );

      await Promise.all(promises);
      toast.success("Word saved successfully!");
      setIsDialogOpen(false);
      setSelectedCollectionNames([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save word");
    } finally {
      setIsSaving(false);
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

          <Dialog open={isDialogOpen} onOpenChange={handleOpenDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-primary group shrink-0"
              >
                <ArrowBigDownDash className="h-5 w-5 text-primary group-hover:text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Save to Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New collection name..."
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddCollection()
                    }
                  />
                  <Button
                    size="icon"
                    onClick={handleAddCollection}
                    disabled={!newCollectionName.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                  {isLoadingCollections ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : userCollections.length === 0 &&
                    selectedCollectionNames.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                      No collections found. Create one above.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {userCollections.map((col) => (
                        <Button
                          key={col.id}
                          variant={
                            selectedCollectionNames.includes(col.name)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="rounded-full"
                          onClick={() => toggleCollectionSelection(col.name)}
                        >
                          {col.name}
                          {selectedCollectionNames.includes(col.name) && (
                            <Check className="ml-1 h-3 w-3" />
                          )}
                        </Button>
                      ))}
                      {selectedCollectionNames
                        .filter(
                          (name) =>
                            !userCollections.find((c) => c.name === name)
                        )
                        .map((name, idx) => (
                          <Button
                            key={`new-${idx}`}
                            variant="default"
                            size="sm"
                            className="rounded-full"
                            onClick={() => toggleCollectionSelection(name)}
                          >
                            {name} <Check className="ml-1 h-3 w-3" />
                          </Button>
                        ))}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={handleSave}
                  disabled={isSaving || selectedCollectionNames.length === 0}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3 text-sm flex-grow mt-2">
          <div>
            <p className="font-semibold text-gray-600">Vietnamese meaning:</p>
            <p className="text-lg font-medium text-gray-800">{vocab.word_vn}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-600">Definition:</p>
            <p className="text-gray-700">{vocab.definition_en}</p>
            <p className="text-muted-foreground italic mt-1">
              {vocab.definition_vi}
            </p>
          </div>

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
