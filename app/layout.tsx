import type { Metadata } from "next";
import { AuthProvider } from "./contexts/AuthContext";
import ConditionalHeader from "./components/ConditionalHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proctor AI Voice Agent",
  description: "AI-powered voice agent for proctoring and admissions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <div className="min-h-screen bg-white">
            <ConditionalHeader />
            <main className="min-h-screen bg-white">
              {children}
            </main>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
