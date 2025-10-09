"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, PlusCircle } from "lucide-react";
import { CollectionCard } from "./components/CollectionCard";
import { wordCollections } from "./data/word-data";

export default function CollectionsPage() {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");

  const sortedCollections = [...wordCollections].sort((a, b) =>
    sortOrder === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  const handleSave = () => {
    if (!title || !words) {
      alert("Please enter all fields.");
      return;
    }
    localStorage.setItem("newCollectionData", JSON.stringify({ title, words }));
    router.push(`/collections/new-review?title=${encodeURIComponent(title)}`);
  };

  return (
    <div className="p-2 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Title */}
        <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap">
          My Vocabulary Collections
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden sm:flex items-center gap-2 text-sm"
              >
                Filter <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Technology</DropdownMenuItem>
              <DropdownMenuItem>Business</DropdownMenuItem>
              <DropdownMenuItem>Science</DropdownMenuItem>
              <DropdownMenuItem>Education</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                Sort by <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                A - Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                Z - A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New collection button (luôn hiển thị) */}
          <Dialog open={open} onOpenChange={setOpen}>
            <Button
              variant="outline"
              onClick={() => setOpen(true)}
              className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2 text-sm"
            >
              <PlusCircle className="h-5 w-5 text-[#2563EB]" />
              New Collection
            </Button>

            {/* Popup tạo collection */}
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-center text-[#1D1D1D] font-bold text-[24px]">
                  Create New Collection
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-[18px] font-bold text-[#373346]">
                    Collection Name
                  </label>
                  <Input
                    placeholder="Enter collection name..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[18px] font-bold text-[#373346] block mb-2">
                    Word List
                  </label>
                  <ul className="text-[16px] text-[#373346] list-disc list-inside space-y-1 mb-2">
                    <li>
                      Just type your words, the system will automatically
                      generate meanings, contexts, and examples for you.
                    </li>
                    <li>Use line breaks to separate words.</li>
                    <li>Maximum 50 words.</li>
                  </ul>
                  <Textarea
                    rows={5}
                    className="resize-none"
                    placeholder="Enter words..."
                    value={words}
                    onChange={(e) => setWords(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSave}
                  className="bg-[#2563EB] text-white hover:bg-blue-600"
                >
                  Save & Review
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedCollections.map((col) => (
          <Link href={`/collections/${col.id}`} key={col.id}>
            <CollectionCard
              title={col.title}
              words={col.words.length}
              lastStudied={col.lastStudied}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
