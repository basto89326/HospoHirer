import { signUp } from "@/app/actions/auth";

export const metadata = { title: "Sign up – HospoLink" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; role?: string }>;
}) {
  const { error, role: defaultRole } = await searchParams;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-[#111111]">
            <i className="fa-solid fa-utensils"></i>
            <span>HospoLink</span>
          </a>
          <p className="text-gray-500 text-sm mt-2">Join the network</p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-3xl shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">Create an account</h1>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signUp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g. Marcus Lee"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
              />
            </div>

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
                minLength={8}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
              />
            </div>

            {/* Role picker */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                I am a…
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input type="radio" name="role" value="worker" required className="peer sr-only" defaultChecked={defaultRole === "worker" || !defaultRole} />
                  <div className="border-2 border-gray-200 rounded-2xl p-4 text-center transition peer-checked:border-orange-400 peer-checked:bg-orange-50">
                    <i className="fa-solid fa-mug-hot text-xl text-gray-400 peer-checked:text-orange-500 mb-2 block"></i>
                    <p className="text-sm font-semibold text-gray-700">Worker</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Barista, chef, wait staff…</p>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input type="radio" name="role" value="employer" className="peer sr-only" defaultChecked={defaultRole === "employer"} />
                  <div className="border-2 border-gray-200 rounded-2xl p-4 text-center transition peer-checked:border-orange-400 peer-checked:bg-orange-50">
                    <i className="fa-solid fa-store text-xl text-gray-400 mb-2 block"></i>
                    <p className="text-sm font-semibold text-gray-700">Employer</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Cafe, restaurant, venue…</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#111111] text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition mt-2"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/auth/login" className="text-[#111111] font-semibold hover:text-orange-600 transition">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
