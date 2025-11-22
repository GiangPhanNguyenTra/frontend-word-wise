"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CircleArrowLeft,
  Search,
  BookText,
  Zap,
  NotepadText,
} from "lucide-react";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const type = "noun";
  const typeStyles: Record<string, string> = {
    noun: "bg-[#E9EFFD] text-[#2563EB]",
    verb: "bg-[#FEE2E2] text-[#C41C1C]",
    adjective: "bg-[#F0FDF4] text-[#16A34A]",
    adverb: "bg-[#f3ecc0] text-[#C38902]",
  };

  return (
    <div className="p-6 flex flex-col items-center gap-2 w-full">
      <div className="relative w-full flex items-center">
        {/* nút Back bên trái */}
        <Button
          className="border border-[#363538] text-[#363538] bg-white hover:bg-gray-100"
          onClick={() => router.back()}
        >
          <CircleArrowLeft className="mr-1" />
          Back
        </Button>

        {/* title căn giữa tuyệt đối */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-[#2563EB]">
          Add Word
        </h1>
      </div>

      <p className="text-[#939393] font-medium text-[16px]">
        Enhance your vocabulary collection with detailed word information
      </p>

      {/* Search input */}
      <div className="relative w-full bg-white">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ABABAB]" />
        <Input
          placeholder="Search word..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Nếu chưa nhập gì → preview mặc định */}
      {search.trim() === "" ? (
        <div className="bg-white rounded-[16px] h-[50vh] w-full inline-flex flex-col justify-center items-center mt-4 shadow-lg">
          <img src="/book.svg" alt="Book" />
          <h1 className="font-medium text-[20px] mt-4">
            Word preview will appear here
          </h1>
          <p className="font-medium text-[18px] text-[#939393]">
            Start typing a word to see AI suggestions
          </p>
        </div>
      ) : (
        /* Nếu đã nhập search → hiển thị suggestions */
        <div className="w-full">
          <div className="bg-white rounded-[16px] h-full w-full inline-flex flex-col p-8 mt-4 shadow-lg">
            <p className="font-medium text-[20px] text-[#1D1D1D]">
              AI Suggestions for "
              <span className="font-bold text-[#2563EB]">{search}</span>"
            </p>

            <div className="w-full inline-flex justify-between flex-row gap-2 mt-4">
              <div className="flex items-center gap-2">
                <BookText />
                <p className="font-semibold text-[18px]">Definitions</p>
              </div>
            </div>

            <div className="mt-4 w-full bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-4">
              <div className="w-full inline-flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {/* Checkbox */}
                  <input type="checkbox" className="h-4 w-4" />
                  {/* Text */}
                  <p className="text-[16px]">Sự may mắn</p>
                </div>

                <div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-sm font-medium ${
                      typeStyles[type] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {type}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[16px] font-medium text-[#939393]">
                  A unit of language that carries meaning.
                </p>
              </div>
            </div>

            <div className="w-full inline-flex justify-between flex-row gap-2 mt-4">
              <div className="flex items-center gap-2">
                <Zap />
                <p className="font-semibold text-[18px]">
                  Related Idioms & Collocations
                </p>
              </div>
            </div>
            <div className="mt-4 w-full bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-4">
              <div className="flex items-center gap-2">
                {/* Checkbox */}
                <input type="checkbox" className="h-4 w-4" />
                {/* Text */}
                <p className="text-[16px]">in other words</p>
              </div>
              <div>
                <p className="text-[16px] font-medium text-[#939393]">
                  to say something in a different way
                </p>
              </div>
            </div>
            <div className="mt-4 w-full bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-4">
              <div className="flex items-center gap-2">
                {/* Checkbox */}
                <input type="checkbox" className="h-4 w-4" />
                {/* Text */}
                <p className="text-[16px]">in other words</p>
              </div>
              <div>
                <p className="text-[16px] font-medium text-[#939393]">
                  to say something in a different way
                </p>
              </div>
            </div>

            <div className="w-full inline-flex justify-between flex-row gap-2 mt-4">
              <div className="flex items-center gap-2">
                <NotepadText />
                <p className="font-semibold text-[18px]">Example Sentences</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-[#FAFAFA] border border-[#CCCCCC] rounded-[10px] p-4">
              <div className="flex items-center gap-2">
                {/* Checkbox */}
                <input type="checkbox" className="h-4 w-4" />
                {/* Text */}
                <p className="text-[16px]">
                  "The word 'serendipity' means finding something good without
                  looking for it."
                </p>
              </div>
              <div>
                <p className="text-[16px] font-medium text-[#939393] italic">
                  Từ 'serendipity' có nghĩa là tìm thấy điều gì đó tốt đẹp mà
                  không chủ đích tìm kiếm."{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[16px] w-full flex flex-col p-8 mt-4 shadow-lg">
            <h2 className="text-xl font-bold text-black mb-4">
              Choose collections
            </h2>

            <div className="flex flex-wrap gap-2">
              {["Science", "Electronic", "Family", "Technology", "Friend"].map(
                (col, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="rounded-full px-4 py-2 text-[#2563EB] border-[#2563EB]/50 bg-[#F3F6FF]"
                  >
                    {col}
                  </Button>
                )
              )}
            </div>

            {/* Add new collection */}
            <div className="flex items-center gap-2 mt-4 w-full">
              <Input placeholder="Add a new collection" className="flex-1" />
              <Button className="bg-[#EBAD25] text-white hover:bg-[#d69820]">
                Let’s start
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-center mt-4">
            <Button className="bg-[#2563EB] text-white hover:bg-blue-800">
              Save to collection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
