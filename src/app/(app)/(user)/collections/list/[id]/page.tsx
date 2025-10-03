// collections/list/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { wordCollections } from "../../data/word-data";
import { WordCard } from "../../components/WordCard";

import { PlusCircle, CircleArrowLeft } from "lucide-react";

export default function CollectionDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const collection = wordCollections.find((c) => c.id === id);

  if (!collection) {
    return <div className="p-6">Collection not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Collection name */}
      <div className="w-full flex flex-row items-center justify-between">
        <Button
          variant="outline"
          className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2"
        >
          <CircleArrowLeft className="h-5 w-5 text-[#2563EB]" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-[#2563EB]">
          {collection.title}
        </h1>
        <Button
          variant="outline"
          className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5 text-[#2563EB]" />
          New Word
        </Button>
      </div>

      {/* Collection information */}
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-row items-center justify-center gap-3">
          <p className="text-[#939393]">{collection.words.length} words</p>
          <p className="text-[#939393] before:content-['•'] before:mx-2">
            Last studied: {collection.lastStudied}
          </p>
          <p className="text-[#939393] before:content-['•'] before:mx-2">
            Created: {collection.createdAt}
          </p>
        </div>
      </div>

      {/* Word list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collection.words.map((w, idx) => (
          <WordCard key={idx} {...w} />
        ))}
      </div>
    </div>
  );
}
