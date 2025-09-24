import { AppFooter } from "@/components/app/AppFooter";

export default function RootAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-20 sm:px-10 lg:px-20 ">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
