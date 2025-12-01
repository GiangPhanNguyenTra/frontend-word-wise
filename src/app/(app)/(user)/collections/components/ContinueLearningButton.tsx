"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

const LEARNING_MODES = [
  { id: "all", label: "Select All" },
  {
    id: "flashcards",
    label: "Flashcards",
    description: "Flip cards to learn meaning, definition, and examples.",
  },
  {
    id: "translation",
    label: "Translation",
    description: "Given Vietnamese meaning, type the English word.",
  },
  {
    id: "definition",
    label: "Definition Choice",
    description:
      "Choose the correct word from 3–4 options based on English definition.",
  },
  {
    id: "fill",
    label: "Fill in the Blank",
    description: "Complete a sentence with the missing word.",
  },
];

export default function ContinueLearningButton({ id }: { id: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (value: string) => {
    if (value === "all") {
      // toggle select all
      if (selected.length === LEARNING_MODES.length - 1) {
        setSelected([]); // unselect all
      } else {
        setSelected(
          LEARNING_MODES.filter((m) => m.id !== "all").map((m) => m.id)
        );
      }
    } else {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
  };

  const startLearning = () => {
    const query = selected.join(",");
    router.push(`/collections/${id}/learn?modes=${query}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          {/* Text responsive */}
          <span className="hidden sm:inline">Continue Learning</span>
          <span className="inline sm:hidden">Continue</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-2xl text-bold">
            Choose Learning Mode
          </DialogTitle>
        </DialogHeader>

        <p className="text-[16px] font-medium text-[#939393] italic text-left">
          Select one or more practice types for this study session.
        </p>
        <div className="space-y-4">
          {LEARNING_MODES.map((mode) => (
            <div key={mode.id} className="flex items-start space-x-2">
              <Checkbox
                id={mode.id}
                checked={
                  mode.id === "all"
                    ? selected.length === LEARNING_MODES.length - 1
                    : selected.includes(mode.id)
                }
                onCheckedChange={() => toggle(mode.id)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor={mode.id} className="font-medium text-[16px]">
                  {mode.label}
                </Label>
                <p className="text-[14px] text-[#939393] leading-[20px]">
                  {mode.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={startLearning} disabled={selected.length === 0}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
