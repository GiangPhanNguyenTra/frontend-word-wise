import { Word } from "../data/word-data";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volume2 } from "lucide-react";
export function Translation({ word }: { word: Word }) {
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);

  // reset khi đổi từ mới
  useEffect(() => {
    setAnswer("");
    setShow(false);
  }, [word]);

  // map style cho loại từ
  const typeStyles: Record<string, string> = {
    noun: "bg-[#E9EFFD] text-[#2563EB]",
    verb: "bg-[#FEE2E2] text-[#C41C1C]",
    adjective: "bg-[#F0FDF4] text-[#16A34A]",
    adverb: "bg-[#F3ECC0] text-[#C38902]",
  };

  const isCorrect = answer.trim().toLowerCase() === word.word.toLowerCase();

  return (
    <div className="w-full h-[50vh] p-4 border rounded-xl shadow-md flex flex-col gap-4">
      {/* Loại từ */}
      <div className="flex justify-center gap-2 items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            typeStyles[word.type] || "bg-gray-200 text-gray-700"
          }`}
        >
          {word.type}
        </span>
        <Volume2 color="#363538" size={18} />
      </div>

      {/* Hiển thị nghĩa tiếng Việt */}
      <div className="mt-4 mb-4">
        <p className="text-[16px] text-[#737373] font-medium text-center">
          Translate to English
        </p>
        <p className="text-xl font-bold text-center mt-2">{word.meaning}</p>
      </div>

      <Input
        className="text-black mb-4"
        placeholder="Type the English word ..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={show}
      />

      {/* Nút Check chỉ hiển thị khi chưa check */}
      {!show && (
        <Button
          className="bg-[#2563EB] hover:bg-blue-800 mt-4"
          onClick={() => setShow(true)}
          disabled={!answer.trim()}
        >
          Check
        </Button>
      )}

      {/* Kết quả */}
      {show && (
        <p className={isCorrect ? "text-green-600" : "text-red-600"}>
          {isCorrect ? "✔ Chính xác!" : `✘ Sai. Đáp án: ${word.word}`}
        </p>
      )}
    </div>
  );
}
