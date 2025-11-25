"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CircleArrowLeft,
  Search,
  BookText,
  Zap,
  NotepadText,
  Loader2,
  Plus,
  Check,
  Volume2,
  Workflow,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getUserCollections,
  getCollectionDetail,
  enrichWord,
  addWordsToCollection,
} from "@/services/collectionService";
import { ApiWord } from "@/types/collection";
import { Collection } from "@/types/dashboard";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordData, setWordData] = useState<ApiWord | null>(null);

  const [selectedDefinitions, setSelectedDefinitions] = useState(true);
  const [selectedExamples, setSelectedExamples] = useState<boolean[]>([]);
  const [selectedIdioms, setSelectedIdioms] = useState<boolean[]>([]);
  const [selectedPhrasalVerbs, setSelectedPhrasalVerbs] = useState<boolean[]>(
    []
  );
  // Thêm state cho Synonyms
  const [selectedSynonyms, setSelectedSynonyms] = useState<boolean[]>([]);

  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [targetCollectionName, setTargetCollectionName] = useState("");

  const typeStyles: Record<string, string> = {
    noun: "bg-[#E9EFFD] text-[#2563EB]",
    verb: "bg-[#FEE2E2] text-[#C41C1C]",
    adjective: "bg-[#F0FDF4] text-[#16A34A]",
    adverb: "bg-[#F3ECC0] text-[#C38902]",
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const cols = await getUserCollections();
        setUserCollections(cols);
      } catch (e) {
        console.error("Failed to load collections");
      }
    };

    const fetchCurrentCollection = async () => {
      if (id) {
        try {
          const detail = await getCollectionDetail(id);
          setTargetCollectionName(detail.name);
          setSelectedCollections([detail.name]);
        } catch (e) {
          console.error("Failed to get collection detail");
        }
      }
    };

    fetchCollections();
    fetchCurrentCollection();
  }, [id]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setIsLoading(true);
    setWordData(null);

    try {
      const data = await enrichWord(search.trim());
      setWordData(data);
      setSelectedDefinitions(true);

      // Khởi tạo trạng thái checkbox cho các mảng
      setSelectedExamples(new Array(data.examples?.length || 0).fill(true));
      setSelectedIdioms(
        new Array(data.idiomsCollocations?.length || 0).fill(true)
      );
      setSelectedPhrasalVerbs(
        new Array(data.phrasalVerbs?.length || 0).fill(true)
      );

      // Xử lý Synonyms: tách chuỗi thành mảng để tạo checkbox
      const synonymsList = data.synonyms
        ? data.synonyms
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : [];
      setSelectedSynonyms(new Array(synonymsList.length).fill(true));
    } catch (error: unknown) {
      toast.error("Could not find word information.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollection = (name: string) => {
    setSelectedCollections((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleAddCollection = () => {
    if (
      newCollectionName.trim() &&
      !userCollections.find((c) => c.name === newCollectionName)
    ) {
      setSelectedCollections((prev) => [...prev, newCollectionName]);
      setNewCollectionName("");
      toast.info(`Collection "${newCollectionName}" added to selection`);
    }
  };

  const handleSave = async () => {
    if (!wordData || selectedCollections.length === 0) {
      toast.error("Please select at least one collection.");
      return;
    }

    // Xử lý logic gộp lại Synonyms từ các checkbox đã chọn
    const originalSynonyms = wordData.synonyms
      ? wordData.synonyms
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];
    const filteredSynonyms = originalSynonyms
      .filter((_, i) => selectedSynonyms[i])
      .join(", ");

    const finalWordData = {
      ...wordData,
      examples: wordData.examples?.filter((_, i) => selectedExamples[i]) || [],
      idiomsCollocations:
        wordData.idiomsCollocations?.filter((_, i) => selectedIdioms[i]) || [],
      phrasalVerbs:
        wordData.phrasalVerbs?.filter((_, i) => selectedPhrasalVerbs[i]) || [],
      synonyms: filteredSynonyms, // Gán lại chuỗi synonyms đã lọc
    };

    setIsLoading(true);
    try {
      const promises = selectedCollections.map((colName) =>
        addWordsToCollection(colName, [finalWordData])
      );

      await Promise.all(promises);
      toast.success("Word added to collection(s) successfully!");

      if (
        selectedCollections.length === 1 &&
        selectedCollections[0] === targetCollectionName
      ) {
        router.push(`/collections/${id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save word.");
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (url: string) => {
    if (url) {
      new Audio(url).play();
    }
  };

  // Helper để lấy danh sách synonyms hiện tại khi render
  const currentSynonymsList = wordData?.synonyms
    ? wordData.synonyms
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <div className="flex flex-col items-center gap-2 w-full mx-auto py-4 lg:p-6 space-y-6">
      <div className="relative w-full flex items-center mb-4">
        <Button
          className="border border-[#363538] text-[#363538] bg-white hover:bg-gray-100"
          onClick={() => router.back()}
        >
          <CircleArrowLeft className="mr-1" />
          Back
        </Button>

        <h1 className="text-2xl lg:text-3xl font-bold text-[#2563EB] absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          Add Word
        </h1>
      </div>

      <div className="relative w-full bg-white flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ABABAB]" />
          <Input
            placeholder="Search word..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Search"}
        </Button>
      </div>

      {!wordData && !isLoading && (
        <div className="bg-white rounded-[16px] h-[50vh] w-full inline-flex flex-col justify-center items-center mt-4 shadow-lg">
          <img src="/book.svg" alt="Book" />
          <h1 className="font-medium text-[20px] mt-4">
            Word preview will appear here
          </h1>
          <p className="font-medium text-[18px] text-[#939393]">
            Start typing a word to see AI suggestions
          </p>
        </div>
      )}

      {wordData && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[16px] h-full w-full inline-flex flex-col p-8 mt-4 shadow-lg">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-[20px] text-[#1D1D1D]">
                AI Suggestions for &quot;
                <span className="font-bold text-[#2563EB]">
                  {wordData.wordText}
                </span>
                &quot;
              </p>

              {/* Phonetics Section */}
              <div className="flex flex-wrap gap-4 items-center">
                {wordData.phonetics?.uk && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border">
                    <span className="font-bold text-[#2563EB] text-sm">UK</span>
                    <span className="text-sm font-mono">
                      {wordData.phonetics.uk.text}
                    </span>
                    {wordData.phonetics.uk.audio && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:text-[#2563EB]"
                        onClick={() => playAudio(wordData.phonetics.uk.audio)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
                {wordData.phonetics?.us && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border">
                    <span className="font-bold text-[#2563EB] text-sm">US</span>
                    <span className="text-sm font-mono">
                      {wordData.phonetics.us.text}
                    </span>
                    {wordData.phonetics.us.audio && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:text-[#2563EB]"
                        onClick={() => playAudio(wordData.phonetics.us.audio)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Definitions Section */}
            <div className="w-full inline-flex justify-between flex-row gap-2 mt-6 border-b pb-2">
              <div className="flex items-center gap-2">
                <BookText />
                <p className="font-semibold text-[18px]">Definitions</p>
              </div>
            </div>

            <div className="mt-4 w-full bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-4">
              <div className="w-full inline-flex justify-between items-start">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#2563EB]"
                      checked={selectedDefinitions}
                      onChange={(e) => setSelectedDefinitions(e.target.checked)}
                    />
                    <p className="text-[16px] font-semibold">
                      {wordData.wordVn}
                    </p>
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <p className="text-[16px] font-medium text-[#939393]">
                      {wordData.definitionEn}
                    </p>
                    {wordData.definitionVi && (
                      <p className="text-[16px] font-medium text-[#939393]">
                        <span className="text-xs bg-gray-200 px-1 rounded mr-2 text-black">
                          VI
                        </span>
                        {wordData.definitionVi}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-sm font-medium whitespace-nowrap ${
                      typeStyles[wordData.partOfSpeech] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {wordData.partOfSpeech}
                  </span>
                </div>
              </div>
            </div>

            {/* Synonyms Section - Đã tách ra riêng */}
            {currentSynonymsList.length > 0 && (
              <>
                <div className="w-full inline-flex justify-between flex-row gap-2 mt-4 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Copy className="h-5 w-5" />
                    <p className="font-semibold text-[18px]">Synonyms</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {currentSynonymsList.map((syn, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-3 transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 min-w-[16px] accent-[#2563EB]"
                        checked={selectedSynonyms[idx]}
                        onChange={(e) => {
                          const newArr = [...selectedSynonyms];
                          newArr[idx] = e.target.checked;
                          setSelectedSynonyms(newArr);
                        }}
                      />
                      <p
                        className="text-[15px] font-medium truncate"
                        title={syn}
                      >
                        {syn}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Phrasal Verbs Section */}
            {wordData.phrasalVerbs && wordData.phrasalVerbs.length > 0 && (
              <>
                <div className="w-full inline-flex justify-between flex-row gap-2 mt-4 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Workflow />
                    <p className="font-semibold text-[18px]">Phrasal Verbs</p>
                  </div>
                </div>
                {wordData.phrasalVerbs.map((item, idx) => (
                  <div
                    key={idx}
                    className="mt-4 w-full bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-4"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#2563EB]"
                        checked={selectedPhrasalVerbs[idx]}
                        onChange={(e) => {
                          const newArr = [...selectedPhrasalVerbs];
                          newArr[idx] = e.target.checked;
                          setSelectedPhrasalVerbs(newArr);
                        }}
                      />
                      <p className="text-[16px] font-medium">{item.en}</p>
                    </div>
                    <div className="ml-6 mt-1">
                      <p className="text-[16px] font-medium text-[#939393]">
                        {item.vi}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Idioms & Collocations Section */}
            {wordData.idiomsCollocations &&
              wordData.idiomsCollocations.length > 0 && (
                <>
                  <div className="w-full inline-flex justify-between flex-row gap-2 mt-4 border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Zap />
                      <p className="font-semibold text-[18px]">
                        Related Idioms & Collocations
                      </p>
                    </div>
                  </div>
                  {wordData.idiomsCollocations.map((item, idx) => (
                    <div
                      key={idx}
                      className="mt-4 w-full bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-4"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[#2563EB]"
                          checked={selectedIdioms[idx]}
                          onChange={(e) => {
                            const newArr = [...selectedIdioms];
                            newArr[idx] = e.target.checked;
                            setSelectedIdioms(newArr);
                          }}
                        />
                        <p className="text-[16px] font-medium">{item.en}</p>
                      </div>
                      <div className="ml-6 mt-1">
                        <p className="text-[16px] font-medium text-[#939393]">
                          {item.vi}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}

            {/* Examples Section */}
            {wordData.examples && wordData.examples.length > 0 && (
              <>
                <div className="w-full inline-flex justify-between flex-row gap-2 mt-4 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <NotepadText />
                    <p className="font-semibold text-[18px]">
                      Example Sentences
                    </p>
                  </div>
                </div>
                {wordData.examples.map((item, idx) => (
                  <div
                    key={idx}
                    className="mt-4 w-full bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-4"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#2563EB]"
                        checked={selectedExamples[idx]}
                        onChange={(e) => {
                          const newArr = [...selectedExamples];
                          newArr[idx] = e.target.checked;
                          setSelectedExamples(newArr);
                        }}
                      />
                      <p className="text-[16px]">&quot;{item.en}&quot;</p>
                    </div>
                    <div className="ml-6 mt-1">
                      <p className="text-[16px] font-medium text-[#939393] italic">
                        {item.vi}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="bg-white rounded-[16px] w-full flex flex-col p-8 mt-4 shadow-lg">
            <h2 className="text-xl font-bold text-black mb-4">
              Choose collections
            </h2>

            <div className="flex flex-wrap gap-2">
              {userCollections.map((col) => (
                <Button
                  key={col.id}
                  variant="outline"
                  onClick={() => toggleCollection(col.name)}
                  className={`rounded-full px-4 py-2 border transition-colors ${
                    selectedCollections.includes(col.name)
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "text-[#2563EB] border-[#2563EB]/50 bg-[#F3F6FF] hover:bg-blue-50"
                  }`}
                >
                  {col.name}
                  {selectedCollections.includes(col.name) && (
                    <Check className="ml-2 h-3 w-3" />
                  )}
                </Button>
              ))}
              {selectedCollections
                .filter((name) => !userCollections.find((c) => c.name === name))
                .map((name, idx) => (
                  <Button
                    key={`new-${idx}`}
                    variant="outline"
                    onClick={() => toggleCollection(name)}
                    className="rounded-full px-4 py-2 bg-[#2563EB] text-white border-[#2563EB]"
                  >
                    {name} <Check className="ml-2 h-3 w-3" />
                  </Button>
                ))}
            </div>

            {/* Add new collection */}
            <div className="flex items-center gap-2 mt-4 w-full">
              <Input
                placeholder="Add a new collection"
                className="flex-1"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCollection()}
              />
              <Button
                className="bg-[#EBAD25] text-white hover:bg-[#d69820]"
                onClick={handleAddCollection}
              >
                <Plus className=" h-4 w-4" /> Add
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-center mt-4 mb-10">
            <Button
              className="bg-[#2563EB] text-white hover:bg-blue-800"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Save to collection"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
