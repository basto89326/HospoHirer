export default function Footer() {
  return (
    <footer className="border-t border-[#EAEAEA] bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <i className="fa-solid fa-utensils"></i>
              <span>HospoLink</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              The ultimate platform for hospitality professionals to find
              shifts, and employers to hire local talent instantly.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-[#111111] transition">
                  Browse Directory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#111111] transition">
                  Worker Sign Up
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#111111] transition">
                  Employer Login
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-[#111111] transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#111111] transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-8 text-sm text-gray-400">
          <p>© 2024 HospoLink. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#111111] transition">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-[#111111] transition">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-[#111111] transition">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
