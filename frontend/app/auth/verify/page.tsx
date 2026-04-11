export const metadata = { title: "Check your email – HospoLink" };

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <a href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-[#111111] mb-8">
          <i className="fa-solid fa-utensils"></i>
          <span>HospoLink</span>
        </a>

        <div className="bg-white border border-[#EAEAEA] rounded-3xl shadow-sm p-10">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-envelope text-orange-500 text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold mb-3">Check your email</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            We&apos;ve sent a confirmation link to your email address. Click it to
            activate your account and you&apos;ll be taken straight to your dashboard.
          </p>
          <p className="text-xs text-gray-400 mt-6">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <a href="/auth/signup" className="text-[#111111] underline">
              sign up again
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
