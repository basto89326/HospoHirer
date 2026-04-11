"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CTASection() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".cta-section", {
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // Floating avatar animations
      gsap.to(".float-anim", {
        y: -15,
        rotation: "+=5",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".float-anim-delay-1", {
        y: 15,
        x: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
      gsap.to(".float-anim-delay-2", {
        y: -10,
        x: -15,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="cta-section py-32 relative overflow-hidden flex justify-center items-center">
      {/* Floating avatars background */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
          className="absolute top-[10%] left-[15%] w-16 h-16 rounded-2xl object-cover -rotate-6 float-anim"
          alt=""
        />
        <img
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
          className="absolute top-[20%] right-[20%] w-12 h-12 rounded-full object-cover rotate-12 float-anim-delay-1"
          alt=""
        />
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
          className="absolute bottom-[20%] left-[25%] w-14 h-14 rounded-full object-cover float-anim-delay-2"
          alt=""
        />
        <img
          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop"
          className="absolute bottom-[15%] right-[15%] w-20 h-20 rounded-2xl object-cover rotate-6 float-anim"
          alt=""
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <i className="fa-solid fa-utensils text-orange-500 text-xl"></i>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Ready to fix hospitality hiring?
        </h2>
        <p className="text-gray-500 mb-10">
          Join the network today. Find work or find staff in minutes.
        </p>

        <div className="flex w-full max-w-md mx-auto bg-white p-1.5 rounded-full border border-gray-200 shadow-sm mb-8">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm w-full"
          />
          <button className="bg-[#111111] text-white px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-800 transition">
            Get Started
          </button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex -space-x-3">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
              className="w-6 h-6 rounded-full border border-white object-cover"
              alt=""
            />
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
              className="w-6 h-6 rounded-full border border-white object-cover"
              alt=""
            />
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
              className="w-6 h-6 rounded-full border border-white object-cover"
              alt=""
            />
          </div>
          <span className="text-xs text-gray-500">
            <strong className="text-[#111111]">2,000+</strong> users already
            joined
          </span>
        </div>
      </div>
    </section>
  );
}
