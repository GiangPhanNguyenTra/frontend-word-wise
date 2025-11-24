import "./globals.css";
import { Montserrat } from "next/font/google";
import ClientRoot from "@/components/ClientRoot";
import RootAppLayout from "@/components/RootAppLayout";

export const metadata = {
  title: "Word Wise",
  description: "Ứng dụng học từ vựng Word Wise",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <ClientRoot>
          <RootAppLayout>{children}</RootAppLayout>
        </ClientRoot>
      </body>
    </html>
  );
}
