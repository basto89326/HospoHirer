export default function Footer() {
  return (
    <footer className="border-t border-[#EAEAEA] bg-white">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-[#111111] mb-4">
            <i className="fa-solid fa-utensils"></i>
            <span>HospoLink</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Built for the pace of hospitality — connect workers and venues
            without the friction.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold text-[#111111] mb-5">Sitemap</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#features" className="hover:text-[#111111] transition">How It Works</a></li>
            <li><a href="#directory" className="hover:text-[#111111] transition">Browse Directory</a></li>
            <li><a href="#benefits" className="hover:text-[#111111] transition">Features</a></li>
            <li><a href="#signup" className="hover:text-[#111111] transition">Sign Up</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} HospoLink. All rights reserved.</p>
          <div className="flex items-center gap-4 text-base">
            <a href="#" className="hover:text-[#111111] transition">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-[#111111] transition">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="#" className="hover:text-[#111111] transition">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
