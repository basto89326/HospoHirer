"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FeaturesSection() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".features-section", {
        scrollTrigger: {
          trigger: ".features-section",
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
    <section className="features-section max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <h2 className="text-3xl md:text-4xl font-bold max-w-md leading-tight">
          Because finding shifts or staff shouldn&apos;t take days.
        </h2>
        <p className="text-gray-500 max-w-sm text-sm">
          Traditional job boards are too slow for the pace of hospitality. We
          connect locals instantly with zero middleman friction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-[#EAEAEA] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-6">
            <i className="fa-solid fa-bolt text-orange-600"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Instant Discovery</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            No complex job listings. Employers simply browse a live directory of
            experienced local workers ready to take on shifts.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#EAEAEA] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <i className="fa-solid fa-phone-volume text-blue-600"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Direct Contact</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Find the right person and reach out immediately. No platform
            messaging walls, no hidden contact fees. Just connect.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#EAEAEA] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <i className="fa-solid fa-location-crosshairs text-green-600"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Hyper-Local Matching</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Workers set their travel radius and availability. Employers filter by
            exact suburb, job type, and schedule to find the perfect fit nearby.
          </p>
        </div>
      </div>
    </section>
  );
}
