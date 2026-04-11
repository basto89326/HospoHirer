"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BentoGrid() {
  const [activeTab, setActiveTab] = useState<"workers" | "employers">("workers");

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

    const handler = (e: Event) => {
      setActiveTab((e as CustomEvent<"workers" | "employers">).detail);
    };
    window.addEventListener("bento-tab", handler);

    return () => {
      ctx.revert();
      window.removeEventListener("bento-tab", handler);
    };
  }, []);

  return (
    <section id="benefits" className="bento-section max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          We built the directory,
          <br />
          now you make the connection
        </h2>
        <div className="inline-flex bg-gray-100 rounded-full p-1 mt-4">
          <button
            onClick={() => setActiveTab("workers")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              activeTab === "workers"
                ? "bg-white shadow-sm text-[#111111]"
                : "text-gray-500 hover:text-[#111111]"
            }`}
          >
            Workers
          </button>
          <button
            onClick={() => setActiveTab("employers")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              activeTab === "employers"
                ? "bg-white shadow-sm text-[#111111]"
                : "text-gray-500 hover:text-[#111111]"
            }`}
          >
            Employers
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Workers Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${
            activeTab === "workers"
              ? "opacity-100"
              : "opacity-0 absolute inset-0 pointer-events-none"
          }`}
        >
          {/* Your Profile */}
          <div className="bg-[#F4F4F6] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
            <div className="z-10 relative">
              <h3 className="text-2xl font-bold mb-2">Your Profile</h3>
              <p className="text-gray-500 text-sm max-w-[250px]">
                Add your work history, certifications (RSA, Food Safety), roles,
                and travel radius. Employers see it all.
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

          {/* Get Discovered */}
          <div className="bg-[#E8F0FE] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
            <div className="z-10 relative">
              <h3 className="text-2xl font-bold mb-2">Enquiries Inbox</h3>
              <p className="text-gray-500 text-sm max-w-[220px]">
                Employers message you directly when they&apos;re interested.
                Track views and enquiries from your dashboard.
              </p>
            </div>
            <div className="absolute bottom-6 right-6 w-[65%] space-y-3">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-white/60">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">
                  Profile Views This Week
                </p>
                <p className="text-3xl font-bold text-[#111111]">34</p>
                <div className="flex items-end gap-1 mt-3 h-10">
                  {[3, 5, 4, 7, 6, 9, 8].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h * 4}px` }}
                      className={`flex-1 rounded-sm ${i === 5 ? "bg-blue-500" : "bg-blue-100"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-3 shadow-md border border-white/60 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-envelope text-orange-500 text-xs"></i>
                </div>
                <div>
                  <p className="text-xs font-bold">New Enquiry</p>
                  <p className="text-[10px] text-gray-500">
                    Patricia&apos;s Espresso Bar · Fitzroy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Free Forever */}
          <div className="bg-[#E2F3E9] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
            <div className="z-10 relative">
              <h3 className="text-2xl font-bold mb-2">Free for Workers</h3>
              <p className="text-gray-500 text-sm max-w-[200px]">
                Creating a profile and getting found by employers costs nothing.
                Always.
              </p>
            </div>
            <div className="absolute bottom-6 right-6 w-[60%] bg-white rounded-3xl shadow-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Your Plan
                </span>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">
                $0
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </p>
              <p className="text-xs text-gray-500 mb-4">Worker Profile</p>
              <div className="space-y-2">
                {[
                  "Work history & certifications",
                  "Enquiries from employers",
                  "Profile view tracking",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-green-500 text-xs"></i>
                    <span className="text-[11px] text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Set Availability */}
          <div className="bg-[#F4F4F6] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&w=400&h=400&fit=crop"
                className="w-full h-full object-cover opacity-30 mix-blend-multiply rounded-r-[2rem]"
                alt="Restaurant interior"
              />
            </div>
            <div className="z-10 relative mt-auto pb-4 bg-gradient-to-t from-[#F4F4F6] pt-12">
              <h3 className="text-2xl font-bold mb-2">Set Availability</h3>
              <p className="text-gray-500 text-sm max-w-[250px]">
                Choose Weekdays, Weekends, Both, or Casual. Update it any time
                from your dashboard.
              </p>
              <div className="bg-white p-4 rounded-xl shadow-lg mt-6 relative z-20 max-w-xs border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Availability
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Both (Weekdays & Weekends)", active: true },
                    { label: "Weekdays only", active: false },
                    { label: "Weekends only", active: false },
                    { label: "Casual", active: false },
                  ].map(({ label, active }) => (
                    <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium ${active ? "bg-[#111111] text-white" : "bg-gray-50 text-gray-500"}`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-white" : "bg-gray-300"}`} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employers Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${
            activeTab === "employers"
              ? "opacity-100"
              : "opacity-0 absolute inset-0 pointer-events-none"
          }`}
        >
          {/* Browse Directory */}
          <div className="bg-[#F0EDFA] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
            <div className="z-10 relative">
              <h3 className="text-2xl font-bold mb-2">Browse Directory</h3>
              <p className="text-gray-500 text-sm max-w-[200px]">
                See each worker&apos;s roles, most recent job, availability, and
                distance from your venue.
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

          {/* Smart Filters */}
          <div className="bg-[#FFF8F0] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
            <div className="z-10 relative">
              <h3 className="text-2xl font-bold mb-2">Smart Filters</h3>
              <p className="text-gray-500 text-sm max-w-[220px]">
                Filter by suburb, role, and availability to find exactly who you
                need.
              </p>
            </div>
            <div className="absolute bottom-6 right-6 w-[65%] bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Active Filters
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: "Suburb: Fitzroy",
                    icon: "fa-location-dot",
                    color: "bg-orange-50 text-orange-600 border-orange-100",
                  },
                  {
                    label: "Role: Barista",
                    icon: "fa-mug-hot",
                    color: "bg-blue-50 text-blue-600 border-blue-100",
                  },
                  {
                    label: "Avail: Weekends",
                    icon: "fa-calendar-check",
                    color: "bg-purple-50 text-purple-600 border-purple-100",
                  },
                ].map((f) => (
                  <span
                    key={f.label}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${f.color}`}
                  >
                    <i className={`fa-solid ${f.icon} text-[9px]`}></i>
                    {f.label}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <strong className="text-[#111111]">12 workers</strong> match
                  your filters
                </p>
              </div>
            </div>
          </div>

          {/* Unlock Contact */}
          <div className="bg-[#E2F3E9] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
            <div className="z-10 relative">
              <h3 className="text-2xl font-bold mb-2">View Full Profile</h3>
              <p className="text-gray-500 text-sm max-w-[200px]">
                Each worker&apos;s phone and email is visible on their profile.
                Message them or call directly.
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

          {/* Fill Shifts Fast */}
          <div className="bg-[#F4F4F6] rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between h-[400px]">
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&w=400&h=400&fit=crop"
                className="w-full h-full object-cover opacity-30 mix-blend-multiply rounded-r-[2rem]"
                alt="Restaurant interior"
              />
            </div>
            <div className="z-10 relative mt-auto pb-4 bg-gradient-to-t from-[#F4F4F6] pt-12">
              <h3 className="text-2xl font-bold mb-2">Fill Shifts Fast</h3>
              <p className="text-gray-500 text-sm max-w-[250px]">
                No job ads. No waiting weeks. Find staff for tomorrow&apos;s
                shift today.
              </p>
              <div className="bg-white p-4 rounded-xl shadow-lg mt-6 flex items-center justify-between relative z-20 max-w-xs border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <i className="fa-solid fa-bolt text-orange-500 text-xs"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Shift Filled</h4>
                    <p className="text-[10px] text-gray-500">
                      Found in under 10 minutes
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
