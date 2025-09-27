import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function DebugAuthPage() {
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

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  const allCookies = cookieStore.getAll();
  const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({ 
              hasSession: !!session, 
              userId: session?.user?.id,
              error: sessionError?.message 
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">User</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({ 
              hasUser: !!user, 
              userId: user?.id,
              email: user?.email,
              error: userError?.message 
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Cookies</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({ 
              totalCookies: allCookies.length,
              supabaseCookies: supabaseCookies.map(c => ({ 
                name: c.name, 
                value: c.value.substring(0, 50) + '...' 
              }))
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
