import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignedOut } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <SignedOut>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black sm:text-5xl md:text-6xl">
              Welcome to{" "}
              <span className="text-black">ProctorAI Admissions</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              AI-powered proctoring solution for secure and fair admissions testing.
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <div className="card p-6">
                <p className="text-sm text-gray-600">
                  Please sign in to access the application.
                </p>
              </div>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
