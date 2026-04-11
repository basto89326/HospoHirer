import { signIn } from "@/app/actions/auth";

export const metadata = { title: "Log in – HospoHirer" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-[#111111]">
            <i className="fa-solid fa-utensils"></i>
            <span>HospoHirer</span>
          </a>
          <p className="text-gray-500 text-sm mt-2">Welcome back</p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-3xl shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">Log in</h1>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#111111] text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition mt-2"
            >
              Log in
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="text-[#111111] font-semibold hover:text-orange-600 transition">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
