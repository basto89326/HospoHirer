"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { createClient } from "@/lib/supabase/browserClient";
import { type EmployerProfile } from "@/lib/types";

interface Props {
  employerAuthId: string;
  onClose: () => void;
}

export default function EmployerProfileModal({ employerAuthId, onClose }: Props) {
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("employers")
      .select("*")
      .eq("auth_id", employerAuthId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setEmployer({
            name:      data.name       ?? "",
            venueName: data.venue_name ?? "",
            venueType: data.venue_type ?? "",
            location:  data.location   ?? "",
            phone:     data.phone      ?? "",
            email:     data.email      ?? "",
            bio:       data.bio        ?? "",
            avatarUrl: data.avatar_url ?? "",
            website:   data.website    ?? "",
          });
        }
        setLoading(false);
      });

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      const modal = document.getElementById("employerProfileModal");
      if (!modal) return;
      gsap.fromTo(modal.children[0], { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        modal.children[1],
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.5)", clearProps: "scale,opacity" }
      );
    });

    return () => { document.body.style.overflow = ""; };
  }, [employerAuthId]);

  function handleClose() {
    const modal = document.getElementById("employerProfileModal");
    if (!modal) { onClose(); return; }
    gsap.to(modal.children[1], {
      scale: 0.95, opacity: 0, duration: 0.2,
      onComplete: onClose,
    });
    gsap.to(modal.children[0], { opacity: 0, duration: 0.2 });
  }

  return (
    <div id="employerProfileModal" className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-lg">Venue Profile</h2>
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
          ) : !employer ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              Profile not found.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Identity */}
              <div className="flex items-center gap-4">
                {employer.avatarUrl ? (
                  <img
                    src={employer.avatarUrl}
                    alt={employer.venueName || employer.name}
                    className="w-16 h-16 rounded-full object-cover border border-gray-100 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl shrink-0">
                    {(employer.venueName || employer.name)[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold leading-tight">
                    {employer.venueName || employer.name}
                  </h3>
                  {employer.venueName && (
                    <p className="text-sm text-gray-500 mt-0.5">{employer.name}</p>
                  )}
                  {employer.venueType && (
                    <span className="mt-1.5 inline-block bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {employer.venueType}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {employer.bio && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{employer.bio}</p>
                </div>
              )}

              {/* Details */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Details</h4>
                {[
                  { icon: "fa-solid fa-location-dot", label: "Location", value: employer.location },
                  { icon: "fa-solid fa-phone",         label: "Phone",    value: employer.phone },
                  { icon: "fa-solid fa-envelope",      label: "Email",    value: employer.email },
                  { icon: "fa-solid fa-globe",         label: "Website",  value: employer.website },
                ]
                  .filter((row) => row.value?.trim())
                  .map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <i className={`${row.icon} text-gray-400 text-xs`}></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400">{row.label}</p>
                        {row.label === "Website" ? (
                          <a
                            href={row.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-orange-600 hover:underline truncate block"
                          >
                            {row.value.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold truncate">{row.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
