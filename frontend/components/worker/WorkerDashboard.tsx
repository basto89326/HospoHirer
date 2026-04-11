"use client";

import { useEffect } from "react";
import gsap from "gsap";

const workHistory = [
  {
    title: "Head Barista",
    place: "The Daily Grind, Fitzroy",
    dates: "Aug 2021 – Present",
    description:
      "Managed coffee operations doing 50kg+ per week. Trained junior staff, maintained equipment, and ensured consistent shot quality during peak morning rushes.",
    current: true,
  },
  {
    title: "Barista",
    place: "Cornerstone Cafe, Richmond",
    dates: "Feb 2019 – Jul 2021",
    description:
      "Handled high-volume coffee service, assisted with FOH duties including running food and operating the POS system.",
    current: false,
  },
  {
    title: "Wait Staff / FOH",
    place: "Bistro 42, Melbourne CBD",
    dates: "Nov 2017 – Jan 2019",
    description:
      "Fast-paced table service, section management, and customer relations in a 100-seat restaurant.",
    current: false,
  },
];

const detailItems = [
  {
    icon: "fa-solid fa-location-dot",
    label: "Location",
    value: "Fitzroy, VIC 3065",
  },
  {
    icon: "fa-solid fa-route",
    label: "Travel Radius",
    value: "10km",
  },
  {
    icon: "fa-regular fa-calendar-check",
    label: "Availability",
    value: "Both (Weekdays & Weekends)",
  },
  {
    icon: "fa-solid fa-phone",
    label: "Contact",
    value: "0412 345 678",
    sub: "marcus.l@email.com",
  },
];

const jobPreferences = [
  { label: "Barista", primary: true },
  { label: "Head Barista" },
  { label: "Cafe Manager" },
  { label: "Front of House" },
];

export default function WorkerDashboard() {
  useEffect(() => {
    gsap.from(".nav-anim", {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    const revealElements = gsap.utils.toArray<HTMLElement>(".gs-reveal");
    gsap.from(revealElements, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.1,
    });

    gsap.fromTo(
      "#progress-bar",
      { width: "0%" },
      { width: "85%", duration: 1.5, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  return (
    <main className="pt-28 pb-20 max-w-6xl mx-auto px-6">
      {/* Header & Profile Completeness */}
      <div className="gs-reveal mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                alt="Marcus L."
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div
                className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"
                title="Online"
              ></div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold">Marcus L.</h1>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center text-[10px] uppercase tracking-wider font-bold gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Visible to employers
                </span>
              </div>
              <p className="text-gray-500">Head Barista & Cafe Manager</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="bg-white border border-gray-200 text-[#111111] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
              <i className="fa-solid fa-share-nodes"></i> Share Profile
            </button>
            <button className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
              <i className="fa-solid fa-pen-to-square"></i> Edit Profile
            </button>
          </div>
        </div>

        {/* Completeness bar */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-sm">Profile Completeness</h3>
              <span className="text-orange-600 font-bold text-sm">85%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                id="progress-bar"
                className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: 0 }}
              ></div>
            </div>
          </div>
          <div className="text-sm text-gray-500 max-w-sm">
            Add your{" "}
            <a
              href="#"
              className="text-[#111111] underline font-medium hover:text-orange-500"
            >
              certifications
            </a>{" "}
            (like RSA or Food Safety) to reach 100% and stand out to more
            employers.
          </div>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Experience Summary */}
          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 shadow-sm gs-reveal">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fa-regular fa-user text-gray-400"></i> Experience
              Summary
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {`Dedicated and fast-paced Head Barista with over 6 years of experience in high-volume specialty coffee shops. Proficient with La Marzocco, Victoria Arduino, and Synesso machines.

Strong understanding of dialling in, alternative brewing methods (V60, Aeropress), and basic latte art (rosettas, tulips, swans). I also have experience managing FOH staff and handling stock ordering. Looking for reliable shifts in a quality-focused environment.`}
            </p>
          </div>

          {/* Work History */}
          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 shadow-sm gs-reveal">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-gray-400"></i>{" "}
                Work History
              </h2>
            </div>

            <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
              {workHistory.map((item) => (
                <div key={item.title + item.dates} className="relative pl-6">
                  <div
                    className={`absolute w-3 h-3 bg-white rounded-full -left-[6.5px] top-1.5 ${
                      item.current
                        ? "border-2 border-[#111111]"
                        : "border-2 border-gray-300"
                    }`}
                  ></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-bold text-base">{item.title}</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md mt-1 sm:mt-0">
                      {item.dates}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    {item.place}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">
          {/* Key details */}
          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm gs-reveal">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-5">
              Worker Details
            </h3>
            <ul className="space-y-4">
              {detailItems.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <i className={`${item.icon} text-gray-500 text-sm`}></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold">{item.value}</p>
                    {item.sub && (
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Job preferences */}
          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm gs-reveal">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">
              Job Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobPreferences.map((pref) => (
                <span
                  key={pref.label}
                  className={
                    pref.primary
                      ? "bg-orange-50 border border-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold"
                      : "bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold"
                  }
                >
                  {pref.label}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm gs-reveal">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">
                Certifications
              </h3>
              <button className="text-xs font-bold text-[#111111] hover:text-orange-500 transition">
                Add
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
              <i className="fa-solid fa-certificate text-orange-400"></i>
              <div>
                <p className="text-sm font-bold">RSA</p>
                <p className="text-[10px] text-gray-500">Victoria • Valid</p>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
              <span className="text-xs text-gray-500 font-medium">
                + Add Food Safety Cert
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
