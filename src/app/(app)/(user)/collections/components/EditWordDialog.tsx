"use client";

import { useState } from "react";
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
  onSave: (updatedWord: UIWord) => void;
  children: React.ReactNode;
}

export function EditWordDialog({
  wordData,
  onSave,
  children,
}: EditWordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(wordData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Word Details</DialogTitle>
          <DialogDescription>
            Modify the content of your vocabulary card.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="word">Word</Label>
                  <Input
                    id="word"
                    value={formData.word}
                    onChange={handleChange}
                    className="font-bold"
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
            </div>

            {/* Phonetics */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold border-b pb-2">Phonetics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phoneticsUkText">UK Phonetic</Label>
                  <Input
                    id="phoneticsUkText"
                    value={formData.phoneticsUkText}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneticsUsText">US Phonetic</Label>
                  <Input
                    id="phoneticsUsText"
                    value={formData.phoneticsUsText}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Definitions */}
            <div className="space-y-4">
              <h3 className="font-semibold border-b pb-2">Definition</h3>
              <div className="grid gap-2">
                <Label htmlFor="definitionEn">English</Label>
                <Textarea
                  id="definitionEn"
                  value={formData.definitionEn}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="definitionVi">Vietnamese</Label>
                <Textarea
                  id="definitionVi"
                  value={formData.definitionVi}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <h3 className="font-semibold border-b pb-2">Example</h3>
              <div className="grid gap-2">
                <Label htmlFor="exampleEn">English</Label>
                <Textarea
                  id="exampleEn"
                  value={formData.exampleEn}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exampleVi">Vietnamese</Label>
                <Textarea
                  id="exampleVi"
                  value={formData.exampleVi}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold border-b pb-2">Synonyms</h3>
              <div className="grid gap-2">
                <Label htmlFor="synonyms">Comma separated list</Label>
                <Input
                  id="synonyms"
                  value={formData.synonyms}
                  onChange={handleChange}
                  placeholder="e.g. fast, quick, rapid"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
