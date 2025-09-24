import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash } from "lucide-react";

type VocabularyProps = {
  word: string;
  vietnameseMeaning: string;
  definition: {
    en: string;
    vi: string;
  };
  example: {
    en: string;
    vi: string;
  };
};

export const VocabularyCard = ({ vocab }: { vocab: VocabularyProps }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl font-bold text-gray-800">{vocab.word}</h4>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-primary group"
          >
            <ArrowBigDownDash className="h-5 w-5 text-primary group-hover:text-white" />
          </Button>
        </div>
        <div className="space-y-3 text-sm ">
          <div>
            <p className="font-semibold text-gray-600">Vietnamese meaning:</p>
            <p className="text-muted-foreground">{vocab.vietnameseMeaning}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Definition:</p>
            <p className="text-gray-700">{vocab.definition.en}</p>
            <p className="text-muted-foreground italic">
              {vocab.definition.vi}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Example:</p>
            <p className="text-gray-700 font-medium">
              &quot;{vocab.example.en}&quot;
            </p>
            <p className="text-muted-foreground italic">
              &quot;{vocab.example.vi}&quot;
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
