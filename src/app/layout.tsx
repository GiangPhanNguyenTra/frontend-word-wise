import "./globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Word Wise",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton duration={5000} />
      </body>
    </html>
  );
}
