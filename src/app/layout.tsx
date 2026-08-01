import type { Metadata } from "next";
import { FirebaseAnalytics } from "../components/FirebaseAnalytics";
import messages from "../locales/en.json";
import "./globals.css";

export const metadata: Metadata = {
  title: messages.meta.title,
  description: messages.meta.description,
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
