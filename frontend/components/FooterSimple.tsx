export default function FooterSimple() {
  return (
    <footer className="border-t border-[#EAEAEA] bg-white pt-10 pb-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-300">
          <i className="fa-solid fa-utensils"></i>
          <span>HospoLink</span>
        </div>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} HospoLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
