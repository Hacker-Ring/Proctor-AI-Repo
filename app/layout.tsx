import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProctorAI Admissions",
  description: "AI-powered proctoring for admissions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedIn>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-lg font-semibold text-gray-900">Welcome back</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 rounded-[6px]"
                          }
                        }}
                      />
                    </div>
                  </div>
                </header>
                <main className="flex-1 bg-white">
                  {children}
                </main>
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="min-h-screen bg-white">
              <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                      <a href="/" className="text-xl font-bold text-black hover:text-gray-700 transition-colors">
                        ProctorAI Admissions
                      </a>
                    </div>
                    <div className="flex items-center space-x-4">
                      <SignInButton mode="modal">
                        <button className="btn-primary">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="btn-secondary">
                          Sign Up
                        </button>
                      </SignUpButton>
                    </div>
                  </div>
                </div>
              </header>
              <main className="min-h-screen bg-white">
                {children}
              </main>
            </div>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
