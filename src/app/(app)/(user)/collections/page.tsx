"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  PenLine,
  Play,
  Loader2,
  LayoutGrid,
  List,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getUserCollections } from "@/services/collectionService";
import { Collection } from "@/types/dashboard";

type SortOption = "name-asc" | "name-desc" | "count-asc" | "count-desc";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" /> Create Collection
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
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
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No collections found.
          </div>
        )}
      </div>
    </div>
  );
}
