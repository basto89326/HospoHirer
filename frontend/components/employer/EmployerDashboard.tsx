"use client";

import { useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { type WorkerCard, type EmployerProfile } from "@/lib/types";
import { createClient } from "@/lib/supabase/browserClient";
import { dispatchEmployerNavAvatar } from "@/lib/employerNavAvatar";

export default function EmployerDashboard() {
  const [modalWorker, setModalWorker] = useState<WorkerCard | null>(null);
  const [workers, setWorkers] = useState<WorkerCard[]>([]);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [availabilityQuery, setAvailabilityQuery] = useState("");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savingId, setSavingId] = useState<number | null>(null);
  const supabase = createClient();

  const filteredWorkers = workers.filter((w) => {
    if (locationQuery && !w.location.toLowerCase().includes(locationQuery.toLowerCase())) return false;
    if (roleQuery && !w.roles.some((r) => r.label.toLowerCase().includes(roleQuery.toLowerCase()))) return false;
    if (availabilityQuery && w.availability.toLowerCase() !== availabilityQuery.toLowerCase()) return false;
    return true;
  });

  useEffect(() => {
    supabase.from("workers").select("*").then(({ data }) => {
      if (data) setWorkers(data as WorkerCard[]);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      // Load employer profile
      supabase
        .from("employers")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data) return;
          const profile: EmployerProfile = {
            name:      data.name       ?? "",
            venueName: data.venue_name ?? "",
            venueType: data.venue_type ?? "",
            location:  data.location   ?? "",
            phone:     data.phone      ?? "",
            email:     data.email      ?? "",
            bio:       data.bio        ?? "",
            avatarUrl: data.avatar_url ?? "",
            website:   data.website    ?? "",
          };
          setEmployer(profile);
          dispatchEmployerNavAvatar(profile.avatarUrl, profile.name);
        });

      // Load saved worker IDs
      supabase
        .from("employer_saved_workers")
        .select("worker_id")
        .eq("employer_auth_id", user.id)
        .then(({ data }) => {
          if (data) setSavedIds(new Set(data.map((row) => row.worker_id as number)));
        });
    });

    const ctx = gsap.context(() => {
      gsap.from(".gs-reveal", {
        y: 10,
        opacity: 0,
        duration: 0.3,
        stagger: 0.04,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    });
    return () => ctx.revert();
  }, []);

  const toggleSave = useCallback(async (workerId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSavingId(workerId);
    const isSaved = savedIds.has(workerId);

    // Optimistic update
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(workerId);
      else next.add(workerId);
      return next;
    });

    if (isSaved) {
      await supabase
        .from("employer_saved_workers")
        .delete()
        .eq("employer_auth_id", user.id)
        .eq("worker_id", workerId);
    } else {
      await supabase
        .from("employer_saved_workers")
        .upsert({ employer_auth_id: user.id, worker_id: workerId });
    }

    setSavingId(null);
  }, [savedIds, supabase]);

  function openModal(worker: WorkerCard) {
    setModalWorker(worker);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const modal = document.getElementById("workerModal");
      if (!modal) return;
      gsap.fromTo(
        modal.children[1],
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.5)", clearProps: "scale,opacity" }
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
      duration: 0.2,
      onComplete: () => {
        setModalWorker(null);
        document.body.style.overflow = "";
      },
    });
    gsap.to(modal.children[0], { opacity: 0, duration: 0.2 });
  }

  return (
    <main className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="gs-reveal mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {employer
            ? `Welcome back${employer.venueName ? `, ${employer.venueName}` : ""}.`
            : "Find your next team member."}
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Browse the live directory of local hospitality professionals. Filter by
          role, availability, and location to find the perfect fit for your venue.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 gs-reveal">
        {[
          { label: "Workers available", value: String(workers.length),                                            icon: "fa-solid fa-users",     color: "text-blue-500" },
          { label: "Online now",        value: String(workers.filter((w) => w.online).length),                    icon: "fa-solid fa-circle",    color: "text-green-500" },
          { label: "Both availability", value: String(workers.filter((w) => w.availability.startsWith("Both")).length),   icon: "fa-regular fa-calendar-check", color: "text-orange-500" },
          { label: "Saved profiles",    value: String(savedIds.size),                                             icon: "fa-solid fa-bookmark",  color: "text-purple-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <i className={`${stat.icon} ${stat.color} text-base`}></i>
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center mb-10 gs-reveal">
        <div className="flex-1 w-full relative">
          <i className="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Suburb or Postcode (e.g. Fitzroy)"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition"
          />
        </div>

        <div className="flex-1 w-full relative">
          <i className="fa-solid fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={roleQuery}
            onChange={(e) => setRoleQuery(e.target.value)}
            placeholder="Job type (e.g. Barista, Chef)"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition"
          />
        </div>

        <div className="flex-1 w-full relative">
          <i className="fa-regular fa-calendar-check absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <select
            value={availabilityQuery}
            onChange={(e) => setAvailabilityQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition appearance-none text-gray-600"
          >
            <option value="">Any Availability</option>
            <option value="Weekdays only">Weekdays only</option>
            <option value="Weekends only">Weekends only</option>
            <option value="Both (Weekdays & Weekends)">Both (Weekdays &amp; Weekends)</option>
            <option value="Casual">Casual</option>
          </select>
        </div>

        <button
          onClick={() => { setLocationQuery(""); setRoleQuery(""); setAvailabilityQuery(""); }}
          className="w-full md:w-auto bg-[#111111] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap"
        >
          Clear
        </button>
      </div>

      {/* Two-column layout: results + sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Results grid */}
        <div className="flex-1 gs-reveal">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
            {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredWorkers.map((worker) => {
              const isSaved = savedIds.has(worker.id);
              return (
                <div
                  key={worker.id}
                  className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="relative">
                        <img
                          src={worker.avatarUrl || "https://i.pravatar.cc/150"}
                          className="w-12 h-12 rounded-full object-cover border border-gray-100"
                          alt={worker.name}
                        />
                        {worker.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-base leading-tight group-hover:text-orange-600 transition-colors">
                          {worker.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <i className="fa-solid fa-location-dot"></i>
                          {worker.location} · {worker.distanceKm}km
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`${worker.availabilityColor} px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide`}
                      >
                        {worker.availability}
                      </span>
                      {/* Bookmark button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(worker.id); }}
                        disabled={savingId === worker.id}
                        title={isSaved ? "Remove from saved" : "Save profile"}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                          isSaved
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-300 bg-white"
                        }`}
                      >
                        <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark text-[11px]`}></i>
                      </button>
                    </div>
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
                    onClick={() => openModal(worker)}
                    className="w-full bg-gray-50 text-[#111111] border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-[#111111] hover:text-white transition"
                  >
                    View Full Profile
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-6 gs-reveal">
          {/* Saved profiles quick-link */}
          {savedIds.size > 0 && (
            <a
              href="/employer/saved"
              className="flex items-center gap-4 bg-orange-50 border border-orange-100 rounded-3xl p-5 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-bookmark text-orange-500"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-orange-900 group-hover:text-orange-600 transition-colors">
                  {savedIds.size} Saved Profile{savedIds.size !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-orange-600 mt-0.5">View your shortlist →</p>
              </div>
            </a>
          )}

          <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-5">
              Recently Listed
            </h3>
            <div className="space-y-4">
              {workers.slice(0, 3).map((w) => (
                <div key={w.id} className="flex items-center gap-3">
                  <img
                    src={w.avatarUrl || "https://i.pravatar.cc/150"}
                    alt={w.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{w.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {w.roles?.find((r) => r.primary)?.label ?? w.roles?.[0]?.label ?? "Worker"}
                    </p>
                  </div>
                </div>
              ))}
              {workers.length === 0 && (
                <p className="text-xs text-gray-400">No workers yet.</p>
              )}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="fa-solid fa-bolt text-orange-500"></i>
              <h3 className="font-bold text-sm text-orange-800">Pro tip</h3>
            </div>
            <p className="text-xs text-orange-700 leading-relaxed">
              Workers with <strong>Both</strong> availability fill shifts fastest.
              Filter by availability to find the best match for your rota.
            </p>
          </div>
        </div>
      </div>

      {/* Worker Profile Modal */}
      {modalWorker && (
        <div id="workerModal" className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-lg">Worker Profile</h2>
              <div className="flex items-center gap-3">
                {/* Save button in modal */}
                <button
                  onClick={() => toggleSave(modalWorker.id)}
                  disabled={savingId === modalWorker.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    savedIds.has(modalWorker.id)
                      ? "bg-orange-500 border-orange-500 text-white hover:bg-orange-600"
                      : "bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
                  }`}
                >
                  <i className={`fa-${savedIds.has(modalWorker.id) ? "solid" : "regular"} fa-bookmark text-xs`}></i>
                  {savedIds.has(modalWorker.id) ? "Saved" : "Save Profile"}
                </button>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition text-gray-500"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Left */}
                <div className="w-full md:w-1/3 space-y-6">
                  <div className="text-center">
                    <img
                      src={modalWorker.avatarUrl || "https://i.pravatar.cc/150"}
                      className="w-24 h-24 rounded-full object-cover border border-gray-100 mx-auto mb-3 shadow-sm"
                      alt={modalWorker.name}
                    />
                    <h3 className="text-2xl font-bold mb-1">{modalWorker.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {modalWorker.roles?.find((r) => r.primary)?.label ?? modalWorker.roles?.[0]?.label ?? "Worker"}
                    </p>
                    <span
                      className={`${modalWorker.availabilityColor} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block`}
                    >
                      {modalWorker.availability}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="bg-[#E2F3E9] rounded-2xl p-5 border border-green-100">
                    <div className="flex items-center gap-2 mb-4 text-green-800">
                      <i className="fa-solid fa-unlock"></i>
                      <span className="font-bold text-sm">Contact Unlocked</span>
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
                        href="mailto:worker@email.com"
                        className="flex items-center gap-3 bg-white p-3 rounded-xl border border-green-50 hover:border-green-300 transition group"
                      >
                        <i className="fa-solid fa-envelope text-green-600"></i>
                        <span className="text-sm font-medium text-gray-800 truncate group-hover:text-green-700">
                          worker@email.com
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
                        <span className="font-medium">{modalWorker.location}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Distance</span>
                        <span className="font-medium">{modalWorker.distanceKm}km away</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Availability</span>
                        <span className="font-medium">{modalWorker.availability}</span>
                      </li>
                      {modalWorker.certifications.length > 0 && (
                        <li className="flex justify-between">
                          <span className="text-gray-500">Certs</span>
                          <span className="font-medium text-right">
                            {modalWorker.certifications.join(", ")}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Right */}
                <div className="w-full md:w-2/3">
                  {/* Roles + bio */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-3">Experience</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {modalWorker.roles.map((role) => (
                        <span
                          key={role.label}
                          className={
                            role.primary
                              ? "bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-md text-xs font-semibold"
                              : "bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold"
                          }
                        >
                          {role.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{modalWorker.bio}</p>
                  </div>

                  {/* Work history timeline */}
                  <div>
                    <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <i className="fa-solid fa-clock-rotate-left text-gray-400"></i>
                      Work History
                    </h4>
                    <div className="relative border-l border-gray-200 ml-2 space-y-6 pb-2">
                      {modalWorker.workHistory.map((entry) => (
                        <div key={entry.title + entry.dates} className="relative pl-6">
                          <div
                            className={`absolute w-2.5 h-2.5 rounded-full -left-[5.5px] top-1.5 ${
                              entry.current ? "bg-[#111111]" : "bg-gray-300"
                            }`}
                          ></div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                            <h5 className="font-bold text-sm">{entry.title}</h5>
                            <span className="text-xs text-gray-500 sm:ml-4 whitespace-nowrap">
                              {entry.dates}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{entry.place}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{entry.description}</p>
                        </div>
                      ))}
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
