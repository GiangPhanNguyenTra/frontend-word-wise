"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusCircle } from "lucide-react";
import { CollectionCard } from "./components/CollectionCard";
import { wordCollections } from "./data/word-data";
import Link from "next/link";

export default function CollectionsPage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedCollections = [...wordCollections].sort((a, b) =>
    sortOrder === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">My Vocabulary Collections</h1>

          {/* Filter dropdown (mock) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Filter <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Technology</DropdownMenuItem>
              <DropdownMenuItem>Business</DropdownMenuItem>
              <DropdownMenuItem>Science</DropdownMenuItem>
              <DropdownMenuItem>Education</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Sort by <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                A - Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                Z - A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* New collection button */}
        <Button
          variant="outline"
          className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5 text-[#2563EB]" />
          New Collection
        </Button>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedCollections.map((col) => (
          <Link href={`/collections/list/${col.id}`} key={col.id}>
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
