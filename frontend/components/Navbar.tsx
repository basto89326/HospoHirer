export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAEAEA] nav-anim">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl cursor-pointer">
          <i className="fa-solid fa-utensils"></i>
          <span>HospoLink</span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-[#111111] transition">
            Browse Directory
          </a>
          <a href="#" className="hover:text-[#111111] transition">
            For Workers
          </a>
          <a href="#" className="hover:text-[#111111] transition">
            For Employers
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden md:block text-sm font-medium text-[#111111] hover:text-gray-600 transition"
          >
            Log in
          </a>
          <button className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition">
            Find Staff
          </button>
        </div>
      </div>
    </nav>
  );
}
