"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  PenLine,
  Play,
  Loader2,
  LayoutGrid,
  List,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { getUserCollections } from "@/services/collectionService";
import { Collection } from "@/types/dashboard";

type SortOption = "name-asc" | "name-desc" | "count-asc" | "count-desc";

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const data = await getUserCollections();
        setCollections(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load collections");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleSave = () => {
    if (!title || !words) {
      toast.error("Please enter all fields.");
      return;
    }
    localStorage.setItem("newCollectionData", JSON.stringify({ title, words }));
    router.push(`/collections/new-review?title=${encodeURIComponent(title)}`);
  };

  const filteredAndSortedCollections = useMemo(() => {
    let result = [...collections];

    if (searchQuery) {
      result = result.filter((col) =>
        col.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "count-asc":
          return a.wordCount - b.wordCount;
        case "count-desc":
          return b.wordCount - a.wordCount;
        default:
          return 0;
      }
    });

    return result;
  }, [collections, searchQuery, sortBy]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-2xl mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">My Collections</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="shrink-0 gap-2 border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
            >
              <PlusCircle className="h-4 w-4 text-[#2563EB]" /> Create
              Collection
            </Button>
          </DialogTrigger>
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
                    Just type your words, the system will automatically generate
                    meanings, contexts, and examples for you.
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

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-[10px] h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="count-desc">Word Count (High)</SelectItem>
              <SelectItem value="count-asc">Word Count (Low)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md bg-background">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-l-md h-9 w-9 ${
                viewMode === "grid" ? "bg-accent text-accent-foreground" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-full bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none rounded-r-md h-9 w-9 ${
                viewMode === "list" ? "bg-accent text-accent-foreground" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {filteredAndSortedCollections.length > 0 ? (
          filteredAndSortedCollections.map((col) => (
            <Card
              key={col.id}
              className="shadow-lg hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] transition-shadow cursor-pointer"
            >
              <CardContent
                className={`p-6 ${
                  viewMode === "list"
                    ? "flex flex-row items-center justify-between gap-4"
                    : ""
                }`}
              >
                <div
                  className={
                    viewMode === "list"
                      ? "flex items-center gap-6 flex-1"
                      : "flex justify-between items-start"
                  }
                >
                  <div className={viewMode === "list" ? "min-w-[200px]" : ""}>
                    <h3 className="text-lg font-semibold">{col.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {col.wordCount} words
                    </p>
                  </div>
                  {viewMode === "list" && (
                    <p className="text-sm text-muted-foreground">
                      Last studied: {col.lastStudied}
                    </p>
                  )}
                  {viewMode === "grid" && (
                    <div className="flex gap-2">
                      <Button variant="icon" size="icon" className="group">
                        <PenLine className="h-4 w-4 text-black group-hover:w-6 group-hover:h-6" />
                      </Button>
                      <Button variant="icon" size="icon" className="group">
                        <Play className="h-4 w-4 text-primary group-hover:w-6 group-hover:h-6" />
                      </Button>
                    </div>
                  )}
                </div>

                {viewMode === "grid" && (
                  <p className="text-xs text-muted-foreground mt-4">
                    Last studied: {col.lastStudied}
                  </p>
                )}

                {viewMode === "list" && (
                  <div className="flex gap-2">
                    <Button variant="icon" size="icon" className="group">
                      <PenLine className="h-4 w-4 text-black group-hover:w-6 group-hover:h-6" />
                    </Button>
                    <Button variant="icon" size="icon" className="group">
                      <Play className="h-4 w-4 text-primary group-hover:w-6 group-hover:h-6" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-dashed border-2">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No collections found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms."
                : "Create your first collection to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setOpen(true)}>Create Collection</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
