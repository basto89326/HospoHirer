"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { mockWorkers, type WorkerCard } from "@/lib/mockData";

// Use 3 saved workers by default (ids matching mockSavedWorkers)
const INITIAL_SAVED_IDS = new Set([1, 3, 7]);

export default function SavedProfiles() {
  const [savedIds, setSavedIds] = useState<Set<number>>(INITIAL_SAVED_IDS);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const saved = mockWorkers.filter((w) => savedIds.has(w.id));
  const filtered = saved.filter(
    (w) =>
      query === "" ||
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.roles.some((r) => r.label.toLowerCase().includes(query.toLowerCase())) ||
      w.location.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    gsap.from(".gs-reveal", {
      y: 10,
      opacity: 0,
      duration: 0.3,
      stagger: 0.04,
      ease: "power2.out",
    });
  }, []);

  function remove(id: number) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (expanded === id) setExpanded(null);
  }

  return (
    <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 md:px-6">
      {/* Page heading */}
      <div className="mb-8 gs-reveal">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <i className="fa-solid fa-bookmark text-gray-400"></i> Saved Profiles
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {saved.length} worker{saved.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved workers..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#EAEAEA] rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition shadow-sm"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="gs-reveal text-center py-20 text-gray-400">
          <i className="fa-regular fa-bookmark text-4xl mb-4 block"></i>
          {query ? (
            <p className="text-sm">No saved workers match &ldquo;{query}&rdquo;</p>
          ) : (
            <p className="text-sm">No saved profiles yet.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((worker) => (
            <SavedCard
              key={worker.id}
              worker={worker}
              expanded={expanded === worker.id}
              onToggle={() => setExpanded(expanded === worker.id ? null : worker.id)}
              onRemove={() => remove(worker.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function SavedCard({
  worker,
  expanded,
  onToggle,
  onRemove,
}: {
  worker: WorkerCard;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="gs-reveal bg-white border border-[#EAEAEA] rounded-3xl shadow-sm overflow-hidden">
      {/* Card header row */}
      <div className="flex items-start gap-4 p-6">
        <div className="relative shrink-0">
          <img
            src={worker.avatarUrl}
            alt={worker.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
          />
          {worker.online && (
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
            <h2 className="text-lg font-bold">{worker.name}</h2>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${worker.availabilityColor}`}>
              {worker.availability}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            <i className="fa-solid fa-location-dot text-xs mr-1"></i>
            {worker.location} · {worker.distanceKm}km away
          </p>

          {/* Roles */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {worker.roles.map((r) => (
              <span
                key={r.label}
                className={
                  r.primary
                    ? "bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                    : "bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full"
                }
              >
                {r.label}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <a
            href="/employer/messages"
            className="hidden sm:flex items-center gap-1.5 bg-[#111111] text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition"
          >
            <i className="fa-solid fa-envelope text-[11px]"></i> Message
          </a>
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-50 transition"
          >
            {expanded ? (
              <>
                <i className="fa-solid fa-chevron-up text-[11px]"></i>
                <span className="hidden sm:inline">Less</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-chevron-down text-[11px]"></i>
                <span className="hidden sm:inline">More</span>
              </>
            )}
          </button>
          <button
            onClick={onRemove}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-200 transition"
            title="Remove from saved"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#EAEAEA] px-6 pb-6 pt-5 space-y-5">
          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
          </div>

          {/* Certifications */}
          {worker.certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {worker.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 px-3 py-1 rounded-full"
                  >
                    <i className="fa-solid fa-certificate text-orange-400 text-[10px]"></i>
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work history */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Work History</h3>
            <div className="space-y-3">
              {worker.workHistory.map((job) => (
                <div key={job.title + job.dates} className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                      job.current ? "bg-[#111111]" : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-semibold leading-snug">{job.title}</p>
                    <p className="text-xs text-gray-500">
                      {job.place} · {job.dates}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile message button */}
          <a
            href="/employer/messages"
            className="sm:hidden flex items-center justify-center gap-2 bg-[#111111] text-white text-sm font-medium py-2.5 rounded-full hover:bg-gray-800 transition w-full"
          >
            <i className="fa-solid fa-envelope"></i> Message {worker.name.split(" ")[0]}
          </a>
        </div>
      )}
    </div>
  );
}
