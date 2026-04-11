"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function HeroSection() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      })
        .from(
          ".hero-image",
          {
            scale: 0.95,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .from(
          ".hero-image > div",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" className="max-w-7xl mx-auto px-6 py-10 md:py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="hero-content order-2 lg:order-1 flex flex-col items-start">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-full text-xs font-medium mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          The lightweight hospitality network
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
          Find. Connect. Hire.
          <br />
          <span className="text-gray-400">No job ads required.</span>
        </h1>

        <p className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed">
          A platform designed for speed. Connect directly with experienced
          local baristas, chefs, and wait staff without the friction of complex
          applications.
        </p>

        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 mb-8">
          <a href="/auth/signup" className="flex-1 bg-[#111111] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm text-center">
            Find Workers
          </a>
          <a href="/auth/signup" className="flex-1 border border-[#EAEAEA] text-[#111111] bg-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition shadow-sm text-center">
            Find Staff
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          </div>
          <span className="text-sm text-gray-500">
            <strong className="text-[#111111]">2,000+</strong> local
            professionals available
          </span>
        </div>
      </div>

      <div className="hero-image order-1 lg:order-2 relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Barista working in a cafe"
          className="w-full h-full object-cover"
        />

        {/* Floating card */}
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 flex items-center gap-4 max-w-[280px]">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <h4 className="font-bold text-sm">Marcus L.</h4>
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Available Now
              </span>
            </div>
            <p className="text-xs text-gray-500">Head Barista • 5km radius</p>
          </div>
        </div>
      </div>
    </section>
  );
}
