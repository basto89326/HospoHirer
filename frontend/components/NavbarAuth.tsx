interface NavbarAuthProps {
  type: "employer" | "worker";
}

export default function NavbarAuth({ type }: NavbarAuthProps) {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAEAEA] nav-anim">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl cursor-pointer">
          <i className="fa-solid fa-utensils text-orange-500"></i>
          <span>HospoLink</span>
        </div>

        {type === "employer" ? (
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="/employer" className="hover:text-[#111111] transition">
              Find Staff
            </a>
            <a href="/employer/saved" className="hover:text-[#111111] transition">
              Saved Profiles
            </a>
            <a href="/employer/messages" className="hover:text-[#111111] transition">
              Messages
            </a>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="/worker" className="hover:text-[#111111] transition">
              Dashboard
            </a>
            <a href="/worker/messages" className="hover:text-[#111111] transition">
              Messages
            </a>
          </div>
        )}

        <div className="flex items-center gap-4">
          {type === "employer" ? (
            <div className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer shadow-sm bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              DG
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden cursor-pointer shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Marcus L."
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
