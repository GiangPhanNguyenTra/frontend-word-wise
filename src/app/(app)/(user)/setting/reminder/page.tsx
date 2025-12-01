// app/setting/reminder/page.tsx

"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUserSettings, updateUserSettings } from "@/services/settingService";

export default function ReminderPage() {
  const [frequency, setFrequency] = useState(1);
  const [words, setWords] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const frequencies = [1, 2, 3, 4];
  const wordOptions = [5, 10, 15, 20];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getUserSettings();
        if (settings) {
          setFrequency(settings.study_sessions_per_day);
          setWords(settings.words_per_session);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserSettings({
        study_sessions_per_day: frequency,
        words_per_session: words,
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-2">
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#2563EB] mb-8">
            Study Reminder Settings (Extension)
          </h2>

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
                  {option === 1
                    ? "Once a day"
                    : option === 2
                    ? "Twice a day"
                    : option === 3
                    ? "Three times a day"
                    : "Four times a day"}
                </Button>
              ))}
            </div>
          </div>

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
                  {option} words
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-[#2563EB] hover:bg-[#1E4FCC] text-white px-6"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
