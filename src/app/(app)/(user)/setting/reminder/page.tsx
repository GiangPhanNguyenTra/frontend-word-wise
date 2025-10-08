"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReminderPage() {
  const [frequency, setFrequency] = useState("Once a day");
  const [words, setWords] = useState("5 words");

  const frequencies = [
    "Once a day",
    "Twice a day",
    "Three times a day",
    "Four times a day",
  ];

  const wordOptions = ["5 words", "10 words", "15 words", "20 words"];

  return (
    <div className="w-full mx-auto px-4 py-2">
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#2563EB] mb-8">
            Study Reminder Settings (Extension)
          </h2>

          {/* Frequency section */}
          <div className="mb-8">
            <p className="font-semibold text-gray-900 mb-3">
              How many times per day would you like to study?
            </p>
            <div className="flex flex-wrap gap-3">
              {frequencies.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => setFrequency(option)}
                  className={`rounded-md px-5 py-2 text-sm font-medium ${
                    frequency === option
                      ? "bg-[#E9EFFD] text-[#2563EB] border-[#2563EB]"
                      : "bg-gray-200 text-gray-600 border-none hover:bg-gray-300"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Words per session section */}
          <div className="mb-8">
            <p className="font-semibold text-gray-900 mb-3">
              How many words or questions per session?
            </p>
            <div className="flex flex-wrap gap-3">
              {wordOptions.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => setWords(option)}
                  className={`rounded-md px-5 py-2 text-sm font-medium ${
                    words === option
                      ? "bg-[#E9EFFD] text-[#2563EB] border-[#2563EB]"
                      : "bg-gray-200 text-gray-600 border-none hover:bg-gray-300"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <Button className="bg-[#2563EB] hover:bg-[#1E4FCC] text-white px-6">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
