import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // Automatically redirect authenticated users to dashboard
    if (user && !error) {
      redirect("/dashboard");
    }
  } catch (error) {
    console.error('Error checking user authentication:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black sm:text-5xl md:text-6xl">
            Welcome to{" "}
            <span className="text-black">Proctor AI Voice Agent</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            AI-powered voice agent for secure and fair proctoring and admissions testing.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-4">
                Please sign in to access the application.
              </p>
              <div className="space-y-3">
                <a
                  href="/auth/signin"
                  className="block w-full btn-primary text-center"
                >
                  Sign In
                </a>
                <a
                  href="/auth/signup"
                  className="block w-full btn-secondary text-center"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
