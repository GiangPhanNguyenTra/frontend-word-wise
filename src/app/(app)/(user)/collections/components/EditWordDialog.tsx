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

interface Word {
  word: string;
  type: string;
  meaning: string;
  definitionEn: string;
  definitionVi: string;
  exampleEn: string;
  exampleVi: string;
}

interface EditWordDialogProps {
  wordData: Word;
  onSave: (updatedWord: Word) => void;
  children: React.ReactNode;
}

export function EditWordDialog({
  wordData,
  onSave,
  children,
}: EditWordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(wordData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Word</DialogTitle>
          <DialogDescription>
            Make changes to your word here. Click save when you&#39; re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4 pl-[2px]">
          <div className="grid gap-2">
            <Label htmlFor="word">Word</Label>
            <Input id="word" value={formData.word} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={formData.type} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="meaning">Vietnamese Meaning</Label>
            <Input
              id="meaning"
              value={formData.meaning}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="definitionEn">Definition (English)</Label>
            <Input
              id="definitionEn"
              value={formData.definitionEn}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="definitionVi">Definition (Vietnamese)</Label>
            <Input
              id="definitionVi"
              value={formData.definitionVi}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="exampleEn">Example (English)</Label>
            <Input
              id="exampleEn"
              value={formData.exampleEn}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="exampleVi">Example (Vietnamese)</Label>
            <Input
              id="exampleVi"
              value={formData.exampleVi}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
