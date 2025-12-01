"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState } from "react";
import { X, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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

interface EditWordDialogProps {
  wordData: UIWord;
  onSave: (updatedWord: UIWord) => Promise<void>;
  children: React.ReactNode;
}

export function EditWordDialog({
  wordData,
  onSave,
  children,
}: EditWordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(wordData);
  const [synonymInput, setSynonymInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // State cho input mới của Collocations
  const [collocationEn, setCollocationEn] = useState("");
  const [collocationVi, setCollocationVi] = useState("");

  // State cho input mới của Phrasal Verbs
  const [phrasalVerbEn, setPhrasalVerbEn] = useState("");
  const [phrasalVerbVi, setPhrasalVerbVi] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- Logic Synonyms ---
  const handleSynonymKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (synonymInput.trim()) {
        const currentSynonyms = formData.synonyms
          ? formData.synonyms.split(",").map((s) => s.trim())
          : [];
        if (!currentSynonyms.includes(synonymInput.trim())) {
          const newSynonyms = [...currentSynonyms, synonymInput.trim()].join(
            ","
          );
          setFormData((prev) => ({ ...prev, synonyms: newSynonyms }));
        }
        setSynonymInput("");
      }
    }
  };

  const removeSynonym = (synToRemove: string) => {
    const currentSynonyms = formData.synonyms
      ? formData.synonyms.split(",").map((s) => s.trim())
      : [];
    const newSynonyms = currentSynonyms
      .filter((s) => s !== synToRemove)
      .join(",");
    setFormData((prev) => ({ ...prev, synonyms: newSynonyms }));
  };

  // --- Logic Collocations ---
  const addCollocation = () => {
    if (collocationEn.trim() && collocationVi.trim()) {
      const newCollocation = {
        en: collocationEn.trim(),
        vi: collocationVi.trim(),
      };
      setFormData((prev) => ({
        ...prev,
        idiomsCollocations: [
          ...(prev.idiomsCollocations || []),
          newCollocation,
        ],
      }));
      setCollocationEn("");
      setCollocationVi("");
    }
  };

  const removeCollocation = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      idiomsCollocations: prev.idiomsCollocations.filter(
        (_, idx) => idx !== indexToRemove
      ),
    }));
  };

  // --- Logic Phrasal Verbs ---
  const addPhrasalVerb = () => {
    if (phrasalVerbEn.trim() && phrasalVerbVi.trim()) {
      const newPhrasal = {
        en: phrasalVerbEn.trim(),
        vi: phrasalVerbVi.trim(),
      };
      setFormData((prev) => ({
        ...prev,
        phrasalVerbs: [...(prev.phrasalVerbs || []), newPhrasal],
      }));
      setPhrasalVerbEn("");
      setPhrasalVerbVi("");
    }
  };

  const removePhrasalVerb = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      phrasalVerbs: prev.phrasalVerbs.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>Edit Word Details</DialogTitle>
            <DialogDescription>
              Modify the content of your vocabulary card.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Basic Information */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="word">Word</Label>
                  <Input
                    id="word"
                    value={formData.word}
                    className="font-bold bg-muted/50"
                    disabled
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Part of Speech</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meaning">Vietnamese Meaning</Label>
                  <Input
                    id="meaning"
                    value={formData.meaning}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* Phonetics */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Phonetics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phoneticsUkText">UK Phonetic</Label>
                  <Input
                    id="phoneticsUkText"
                    value={formData.phoneticsUkText}
                    onChange={handleChange}
                    placeholder="/.../"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneticsUsText">US Phonetic</Label>
                  <Input
                    id="phoneticsUsText"
                    value={formData.phoneticsUsText}
                    onChange={handleChange}
                    placeholder="/.../"
                  />
                </div>
              </div>
            </section>

            {/* Definitions */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Definition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="definitionEn">English</Label>
                  <Textarea
                    id="definitionEn"
                    value={formData.definitionEn}
                    onChange={handleChange}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="definitionVi">Vietnamese</Label>
                  <Textarea
                    id="definitionVi"
                    value={formData.definitionVi}
                    onChange={handleChange}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Examples */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Example
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="exampleEn">English</Label>
                  <Textarea
                    id="exampleEn"
                    value={formData.exampleEn}
                    onChange={handleChange}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exampleVi">Vietnamese</Label>
                  <Textarea
                    id="exampleVi"
                    value={formData.exampleVi}
                    onChange={handleChange}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Synonyms */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Synonyms
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="synonymsInput">Add Synonyms</Label>
                <Input
                  id="synonymsInput"
                  value={synonymInput}
                  onChange={(e) => setSynonymInput(e.target.value)}
                  onKeyDown={handleSynonymKeyDown}
                  placeholder="Type a synonym and press Enter..."
                />
                <div className="flex flex-wrap gap-2 mt-2 min-h-[2.5rem] p-2 bg-muted/20 rounded-md border border-dashed">
                  {formData.synonyms ? (
                    formData.synonyms.split(",").map((syn, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="pl-2 pr-1 py-1 flex items-center gap-1 hover:bg-secondary/80"
                      >
                        {syn.trim()}
                        <button
                          onClick={() => removeSynonym(syn.trim())}
                          className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic px-2">
                      No synonyms added
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Collocations */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Collocations
              </h3>
              <div className="flex gap-2 items-end">
                <div className="grid gap-2 flex-1">
                  <Label>English</Label>
                  <Input
                    value={collocationEn}
                    onChange={(e) => setCollocationEn(e.target.value)}
                    placeholder="e.g. take a break"
                  />
                </div>
                <div className="grid gap-2 flex-1">
                  <Label>Vietnamese</Label>
                  <Input
                    value={collocationVi}
                    onChange={(e) => setCollocationVi(e.target.value)}
                    placeholder="e.g. nghỉ ngơi"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCollocation}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {formData.idiomsCollocations &&
                formData.idiomsCollocations.length > 0 ? (
                  formData.idiomsCollocations.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-md border"
                    >
                      <div className="text-sm">
                        <span className="font-medium">{item.en}</span>
                        <span className="mx-2 text-muted-foreground">-</span>
                        <span className="text-muted-foreground italic">
                          {item.vi}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:text-red-600"
                        onClick={() => removeCollocation(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic p-2 border border-dashed rounded-md text-center">
                    No collocations added
                  </div>
                )}
              </div>
            </section>

            {/* Phrasal Verbs */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Phrasal Verbs
              </h3>
              <div className="flex gap-2 items-end">
                <div className="grid gap-2 flex-1">
                  <Label>English</Label>
                  <Input
                    value={phrasalVerbEn}
                    onChange={(e) => setPhrasalVerbEn(e.target.value)}
                    placeholder="e.g. give up"
                  />
                </div>
                <div className="grid gap-2 flex-1">
                  <Label>Vietnamese</Label>
                  <Input
                    value={phrasalVerbVi}
                    onChange={(e) => setPhrasalVerbVi(e.target.value)}
                    placeholder="e.g. từ bỏ"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addPhrasalVerb}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {formData.phrasalVerbs && formData.phrasalVerbs.length > 0 ? (
                  formData.phrasalVerbs.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-md border"
                    >
                      <div className="text-sm">
                        <span className="font-medium">{item.en}</span>
                        <span className="mx-2 text-muted-foreground">-</span>
                        <span className="text-muted-foreground italic">
                          {item.vi}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:text-red-600"
                        onClick={() => removePhrasalVerb(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic p-2 border border-dashed rounded-md text-center">
                    No phrasal verbs added
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="p-6 pt-4 border-t bg-gray-50/50">
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
