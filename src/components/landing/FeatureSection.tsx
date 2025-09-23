import Image from "next/image";

interface FeatureSectionProps {
  title: React.ReactNode;
  description: string;
  imageUrl: string;
  reverse?: boolean; // cờ để đảo ngược vị trí ảnh và chữ
}

export const FeatureSection = ({
  title,
  description,
  imageUrl,
  reverse = false,
}: FeatureSectionProps) => {
  return (
    <div className="container mx-auto py-24 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image Column */}
        <div
          className={`flex justify-center ${reverse ? "md:order-last" : ""}`}
        >
          <Image
            src={imageUrl}
            alt="Feature illustration"
            width={500}
            height={400}
          />
        </div>

        {/* Text Column */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-shape4 leading-tight mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};
