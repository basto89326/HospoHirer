"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { createClient } from "@/lib/supabase/browserClient";
import { type WorkerCard } from "@/lib/types";

interface Props {
  workerAuthId: string;
  onClose: () => void;
}

export default function WorkerProfileModal({ workerAuthId, onClose }: Props) {
  const [worker, setWorker] = useState<WorkerCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("workers")
      .select("*")
      .eq("auth_id", workerAuthId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setWorker(data as WorkerCard);
        setLoading(false);
      });

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      const modal = document.getElementById("workerProfileModal");
      if (!modal) return;
      gsap.fromTo(modal.children[0], { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        modal.children[1],
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.5)", clearProps: "scale,opacity" }
      );
    });

    return () => { document.body.style.overflow = ""; };
  }, [workerAuthId]);

  function handleClose() {
    const modal = document.getElementById("workerProfileModal");
    if (!modal) { onClose(); return; }
    gsap.to(modal.children[1], { scale: 0.95, opacity: 0, duration: 0.2, onComplete: onClose });
    gsap.to(modal.children[0], { opacity: 0, duration: 0.2 });
  }

  return (
    <div id="workerProfileModal" className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-lg">Worker Profile</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition text-gray-500"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-7">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              Loading profile…
            </div>
          ) : !worker ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              Profile not found.
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left */}
              <div className="w-full md:w-1/3 space-y-5">
                <div className="text-center">
                  <img
                    src={worker.avatarUrl || "https://i.pravatar.cc/150"}
                    alt={worker.name}
                    className="w-20 h-20 rounded-full object-cover border border-gray-100 mx-auto mb-3 shadow-sm"
                  />
                  <h3 className="text-xl font-bold mb-1">{worker.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {worker.roles?.find((r) => r.primary)?.label ?? worker.roles?.[0]?.label ?? "Worker"}
                  </p>
                  <span className={`${worker.availabilityColor} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block`}>
                    {worker.availability}
                  </span>
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Details</h4>
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="font-medium">{worker.location || "—"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Distance</span>
                      <span className="font-medium">{worker.distanceKm}km away</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Availability</span>
                      <span className="font-medium">{worker.availability}</span>
                    </li>
                    {worker.certifications?.length > 0 && (
                      <li className="flex justify-between">
                        <span className="text-gray-500">Certs</span>
                        <span className="font-medium text-right">
                          {worker.certifications.join(", ")}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Right */}
              <div className="w-full md:w-2/3 space-y-6">
                {/* Roles + bio */}
                <div>
                  <h4 className="text-base font-bold mb-2">Experience</h4>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {worker.roles?.map((role) => (
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
                  {worker.bio && (
                    <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
                  )}
                </div>

                {/* Work history */}
                {worker.workHistory?.length > 0 && (
                  <div>
                    <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-clock-rotate-left text-gray-400"></i> Work History
                    </h4>
                    <div className="relative border-l border-gray-200 ml-2 space-y-5 pb-1">
                      {worker.workHistory.map((entry) => (
                        <div key={entry.title + entry.dates} className="relative pl-6">
                          <div
                            className={`absolute w-2.5 h-2.5 rounded-full -left-[5.5px] top-1.5 ${
                              entry.current ? "bg-[#111111]" : "bg-gray-300"
                            }`}
                          />
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-0.5">
                            <h5 className="font-bold text-sm">{entry.title}</h5>
                            <span className="text-xs text-gray-500 sm:ml-4 whitespace-nowrap">{entry.dates}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-600 mb-0.5">{entry.place}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{entry.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
