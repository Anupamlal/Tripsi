import type { Metadata } from "next";
import { FirebaseAnalytics } from "../components/FirebaseAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tripsi — Travel, thoughtfully planned",
  description: "Personalized trips made simple.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
