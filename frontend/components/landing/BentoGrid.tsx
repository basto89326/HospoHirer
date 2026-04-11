"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BentoGrid() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".bento-section", {
        scrollTrigger: {
          trigger: ".bento-section",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bento-section max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          We built the directory,
          <br />
          now you make the connection
        </h2>
        <div className="inline-flex bg-gray-100 rounded-full p-1 mt-4">
          <button className="px-6 py-2 bg-white rounded-full text-sm font-medium shadow-sm">
            Workers
          </button>
          <button className="px-6 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-[#111111] transition">
            Employers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Worker Profiles */}
        <div className="bg-[#F4F4F6] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
          <div className="z-10 relative">
            <h3 className="text-2xl font-bold mb-2">Worker Profiles</h3>
            <p className="text-gray-500 text-sm max-w-[250px]">
              Post your experience, availability, and travel radius. Let
              employers find you.
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-[80%] bg-white rounded-t-3xl shadow-2xl border border-gray-100 overflow-hidden translate-x-10">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1583332426815-5e04288f6b7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Chef preparing food"
              className="w-full h-48 object-cover opacity-80"
            />
            <div className="p-4 bg-white shadow-lg absolute bottom-4 left-4 rounded-xl flex items-center gap-3 w-[85%]">
              <i className="fa-solid fa-briefcase text-gray-400"></i>
              <div>
                <p className="text-xs font-bold">Past Experience</p>
                <p className="text-[10px] text-gray-500">
                  Sous Chef @ The Local Cafe • 3 yrs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employer Dashboard */}
        <div className="bg-[#F0EDFA] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
          <div className="z-10 relative">
            <h3 className="text-2xl font-bold mb-2">Employer Dashboard</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">
              Search and filter a live directory by suburb and job type.
            </p>
          </div>
          <div className="absolute -bottom-12 right-0 w-[70%] bg-white rounded-t-3xl shadow-2xl border border-gray-100 p-4 rotate-[-5deg] origin-bottom-right">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Results in Richmond
              </span>
              <i className="fa-solid fa-sliders text-gray-400"></i>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://i.pravatar.cc/100?img=5"
                className="w-10 h-10 rounded-full"
                alt="Emma Davies"
              />
              <div>
                <h4 className="text-sm font-bold">Emma Davies</h4>
                <p className="text-xs text-gray-500">Wait Staff • Weekends</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4 opacity-70">
              <img
                src="https://i.pravatar.cc/100?img=8"
                className="w-10 h-10 rounded-full"
                alt="Liam Smith"
              />
              <div>
                <h4 className="text-sm font-bold">Liam Smith</h4>
                <p className="text-xs text-gray-500">Bartender • Casual</p>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Contact */}
        <div className="bg-[#E2F3E9] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
          <div className="z-10 relative">
            <h3 className="text-2xl font-bold mb-2">Direct Contact</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">
              Skip the application portal. Reach out directly via phone or
              email.
            </p>
          </div>
          <div className="absolute -bottom-8 right-10 w-[60%] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-64 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-unlock text-green-600 text-xl"></i>
            </div>
            <h4 className="font-bold text-lg mb-1">Contact Unlocked</h4>
            <p className="text-xs text-gray-500 mb-6">
              You can now reach this worker directly.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <i className="fa-solid fa-phone text-gray-400"></i>
                <span className="text-sm font-medium">0412 345 678</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <i className="fa-solid fa-envelope text-gray-400"></i>
                <span className="text-sm font-medium truncate">
                  emma.d@email.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Public Directory */}
        <div className="bg-[#F4F4F6] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&w=400&h=400&fit=crop"
              className="w-full h-full object-cover opacity-30 mix-blend-multiply rounded-r-[2rem]"
              alt="Restaurant interior"
            />
          </div>
          <div className="z-10 relative mt-auto pb-4 bg-gradient-to-t from-[#F4F4F6] pt-12">
            <h3 className="text-2xl font-bold mb-2">Public Directory</h3>
            <p className="text-gray-500 text-sm max-w-[250px]">
              Browse anonymously. Create an employer account to unlock full work
              history and contact details.
            </p>
            <div className="bg-white p-4 rounded-xl shadow-lg mt-6 flex items-center justify-between relative z-20 max-w-xs border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <i className="fa-solid fa-user-shield text-orange-500 text-xs"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold">Secure Access</h4>
                  <p className="text-[10px] text-gray-500">
                    Contact info protected
                  </p>
                </div>
              </div>
              <button className="bg-[#111111] text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
