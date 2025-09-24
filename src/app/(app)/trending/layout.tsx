import { TrendingHeader } from "@/components/app/TrendingHeader";

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TrendingHeader />
      {children}
    </>
  );
}
