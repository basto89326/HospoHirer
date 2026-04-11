"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

type Availability = "Both" | "Weekends" | "Casual" | "Weekdays";

interface WorkerCardData {
  id: number;
  name: string;
  location: string;
  distanceKm: number;
  availability: Availability;
  availabilityColor: string;
  avatarUrl: string;
  online: boolean;
  roles: { label: string; primary?: boolean }[];
  mostRecentRole: string;
  mostRecentPlace: string;
  mostRecentDates: string;
}

const workers: WorkerCardData[] = [
  {
    id: 1,
    name: "Marcus L.",
    location: "Fitzroy",
    distanceKm: 10,
    availability: "Both",
    availabilityColor: "bg-green-100 text-green-700",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
    online: true,
    roles: [
      { label: "Head Barista", primary: true },
      { label: "Cafe Manager" },
    ],
    mostRecentRole: "Head Barista @ The Daily Grind",
    mostRecentPlace: "",
    mostRecentDates: "Aug 2021 – Present",
  },
  {
    id: 2,
    name: "Emma Davies",
    location: "Richmond",
    distanceKm: 5,
    availability: "Weekends",
    availabilityColor: "bg-purple-100 text-purple-700",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    online: false,
    roles: [{ label: "Wait Staff" }, { label: "FOH" }],
    mostRecentRole: "Senior Waitress @ Bistro 42",
    mostRecentPlace: "",
    mostRecentDates: "Mar 2022 – Present",
  },
  {
    id: 3,
    name: "Liam Smith",
    location: "CBD",
    distanceKm: 15,
    availability: "Casual",
    availabilityColor: "bg-blue-100 text-blue-700",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    online: true,
    roles: [{ label: "Bartender" }, { label: "Mixologist" }],
    mostRecentRole: "Lead Bartender @ The Rooftop",
    mostRecentPlace: "",
    mostRecentDates: "Jan 2020 – Oct 2023",
  },
  {
    id: 4,
    name: "Sarah J.",
    location: "Collingwood",
    distanceKm: 8,
    availability: "Weekdays",
    availabilityColor: "bg-amber-100 text-amber-700",
    avatarUrl:
      "https://images.unsplash.com/photo-1583332426815-5e04288f6b7e?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
    online: false,
    roles: [{ label: "Sous Chef" }, { label: "Kitchen Hand" }],
    mostRecentRole: "Sous Chef @ Fine Dining Co.",
    mostRecentPlace: "",
    mostRecentDates: "May 2018 – Jan 2024",
  },
];

export default function EmployerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);

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
  }, []);

  function openModal() {
    setModalOpen(true);
    document.body.style.overflow = "hidden";
    // Slight delay to allow DOM update before animating
    requestAnimationFrame(() => {
      const modal = document.getElementById("workerModal");
      if (!modal) return;
      gsap.fromTo(
        modal.children[1],
        { scale: 0.95, opacity: 0, y: "-45%" },
        { scale: 1, opacity: 1, y: "-50%", duration: 0.3, ease: "back.out(1.5)" }
      );
      gsap.fromTo(modal.children[0], { opacity: 0 }, { opacity: 1, duration: 0.3 });
    });
  }

  function closeModal() {
    const modal = document.getElementById("workerModal");
    if (!modal) return;
    gsap.to(modal.children[1], {
      scale: 0.95,
      opacity: 0,
      y: "-45%",
      duration: 0.2,
      onComplete: () => {
        setModalOpen(false);
        document.body.style.overflow = "";
      },
    });
    gsap.to(modal.children[0], { opacity: 0, duration: 0.2 });
  }

  return (
    <main className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      {/* Header & Search */}
      <div className="gs-reveal mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Find your next team member.
        </h1>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Browse the live directory of local hospitality professionals. Filter by
          role, availability, and location to find the perfect fit for your venue.
        </p>

        {/* Filters */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <i className="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Suburb or Postcode (e.g. Fitzroy)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition"
            />
          </div>

          <div className="flex-1 w-full relative">
            <i className="fa-solid fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition appearance-none text-gray-600">
              <option value="">Any Job Type</option>
              <option value="barista">Barista</option>
              <option value="chef">Chef / Kitchen Hand</option>
              <option value="waitstaff">Wait Staff</option>
              <option value="bartender">Bartender</option>
            </select>
          </div>

          <div className="flex-1 w-full relative">
            <i className="fa-regular fa-calendar-check absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition appearance-none text-gray-600">
              <option value="">Any Availability</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="both">Both</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <button className="w-full md:w-auto bg-[#111111] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap">
            Search
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all gs-reveal group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="relative">
                  <img
                    src={worker.avatarUrl}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    alt={worker.name}
                  />
                  {worker.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-orange-600 transition-colors">
                    {worker.name}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-location-dot"></i>
                    {worker.location} ({worker.distanceKm}km)
                  </p>
                </div>
              </div>
              <span
                className={`${worker.availabilityColor} px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide`}
              >
                {worker.availability}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {worker.roles.map((role) => (
                <span
                  key={role.label}
                  className={
                    role.primary
                      ? "bg-orange-50 border border-orange-100 text-orange-700 px-2 py-1 rounded-md text-[10px] font-semibold"
                      : "bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded-md text-[10px] font-semibold"
                  }
                >
                  {role.label}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                Most Recent
              </p>
              <p className="text-sm font-medium text-gray-800 truncate">
                {worker.mostRecentRole}
              </p>
              <p className="text-xs text-gray-500">{worker.mostRecentDates}</p>
            </div>

            <button
              onClick={worker.id === 1 ? openModal : undefined}
              className="w-full bg-gray-50 text-[#111111] border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-[#111111] hover:text-white transition"
            >
              View Full Profile
            </button>
          </div>
        ))}
      </div>

      {/* Worker Profile Modal */}
      {modalOpen && (
        <div id="workerModal" className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-lg">Worker Profile</h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition text-gray-500"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-8 overflow-y-auto modal-scroll">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Left: Core info & contact */}
                <div className="w-full md:w-1/3 space-y-6">
                  <div className="text-center">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&w=150&h=150&fit=crop"
                      className="w-24 h-24 rounded-full object-cover border border-gray-100 mx-auto mb-3 shadow-sm"
                      alt="Marcus L."
                    />
                    <h3 className="text-2xl font-bold mb-1">Marcus L.</h3>
                    <p className="text-sm text-gray-500 mb-3">Head Barista</p>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block">
                      Available: Both
                    </span>
                  </div>

                  {/* Contact (unlocked) */}
                  <div className="bg-[#E2F3E9] rounded-2xl p-5 border border-green-100">
                    <div className="flex items-center gap-2 mb-4 text-green-800">
                      <i className="fa-solid fa-unlock"></i>
                      <span className="font-bold text-sm">
                        Contact Unlocked
                      </span>
                    </div>
                    <div className="space-y-3">
                      <a
                        href="tel:0412345678"
                        className="flex items-center gap-3 bg-white p-3 rounded-xl border border-green-50 hover:border-green-300 transition group"
                      >
                        <i className="fa-solid fa-phone text-green-600"></i>
                        <span className="text-sm font-medium text-gray-800 group-hover:text-green-700">
                          0412 345 678
                        </span>
                      </a>
                      <a
                        href="mailto:marcus.l@email.com"
                        className="flex items-center gap-3 bg-white p-3 rounded-xl border border-green-50 hover:border-green-300 transition group"
                      >
                        <i className="fa-solid fa-envelope text-green-600"></i>
                        <span className="text-sm font-medium text-gray-800 truncate group-hover:text-green-700">
                          marcus.l@email.com
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Details
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium">Fitzroy</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Travel Radius</span>
                        <span className="font-medium">10km</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Certs</span>
                        <span className="font-medium">RSA</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right: Experience & history */}
                <div className="w-full md:w-2/3">
                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-3">Experience</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                        Barista
                      </span>
                      <span className="bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                        Cafe Manager
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Dedicated and fast-paced Head Barista with over 6 years of
                      experience in high-volume specialty coffee shops. Proficient
                      with La Marzocco, Victoria Arduino, and Synesso machines.
                      Strong understanding of dialling in, alternative brewing
                      methods, and team management.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <i className="fa-solid fa-clock-rotate-left text-gray-400"></i>
                      Work History
                    </h4>

                    <div className="relative border-l border-gray-200 ml-2 space-y-6 pb-2">
                      <div className="relative pl-6">
                        <div className="absolute w-2.5 h-2.5 bg-[#111111] rounded-full -left-[5.5px] top-1.5"></div>
                        <div className="flex justify-between items-baseline mb-1">
                          <h5 className="font-bold text-sm">Head Barista</h5>
                          <span className="text-xs text-gray-500">
                            Aug 2021 – Present
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          The Daily Grind, Fitzroy
                        </p>
                        <p className="text-xs text-gray-500">
                          Managed coffee operations doing 50kg+ per week. Trained
                          junior staff.
                        </p>
                      </div>

                      <div className="relative pl-6">
                        <div className="absolute w-2.5 h-2.5 bg-gray-300 rounded-full -left-[5.5px] top-1.5"></div>
                        <div className="flex justify-between items-baseline mb-1">
                          <h5 className="font-bold text-sm">Barista</h5>
                          <span className="text-xs text-gray-500">
                            Feb 2019 – Jul 2021
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Cornerstone Cafe, Richmond
                        </p>
                        <p className="text-xs text-gray-500">
                          Handled high-volume coffee service and FOH duties.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
