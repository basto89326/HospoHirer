"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createClient } from "@/lib/supabase/browserClient";
import { dispatchEmployerNavAvatar } from "@/lib/employerNavAvatar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditableEmployerProfile {
  name:      string;
  venueName: string;
  venueType: string;
  location:  string;
  phone:     string;
  email:     string;
  bio:       string;
  avatarUrl: string;
  website:   string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calculateCompletion(p: EditableEmployerProfile): number {
  if (p.name === "Loading...") return 0;
  let score = 0;
  if (p.name?.trim())      score += 15;
  if (p.venueName?.trim()) score += 15;
  if (p.venueType?.trim()) score += 10;
  if (p.location?.trim())  score += 15;
  if (p.bio?.trim())       score += 20;
  if (p.phone?.trim())     score += 10;
  if (p.email?.trim())     score += 10;
  if (p.website?.trim())   score += 5;
  return Math.min(100, score);
}

function emptyProfile(): EditableEmployerProfile {
  return {
    name:      "Loading...",
    venueName: "",
    venueType: "",
    location:  "",
    phone:     "",
    email:     "",
    bio:       "",
    avatarUrl: "",
    website:   "",
  };
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white";
const labelCls =
  "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1";

const VENUE_TYPES = [
  "Cafe",
  "Restaurant",
  "Bar / Pub",
  "Hotel",
  "Events / Catering",
  "Fast Food",
  "Bakery",
  "Other",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmployerProfileDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [authId,    setAuthId]    = useState<string | null>(null);
  const [profile,   setProfile]   = useState<EditableEmployerProfile>(emptyProfile());
  const [draft,     setDraft]     = useState<EditableEmployerProfile>(emptyProfile());
  const progressRef = useRef<HTMLDivElement>(null);

  // ── Load profile ────────────────────────────────────────────────────────────

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setAuthId(user.id);

      supabase
        .from("employers")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data) return;
          const loaded: EditableEmployerProfile = {
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
          setProfile(loaded);
          setDraft(loaded);
          dispatchEmployerNavAvatar(loaded.avatarUrl, loaded.name);
        });
    });

    const ctx = gsap.context(() => {
      gsap.from(".gs-reveal", {
        y: 10, opacity: 0, duration: 0.3, stagger: 0.04,
        ease: "power2.out", clearProps: "opacity,transform",
      });
    });
    return () => ctx.revert();
  }, []);

  // ── Progress bar ────────────────────────────────────────────────────────────

  const displayProfile    = isEditing ? draft : profile;
  const currentCompletion = calculateCompletion(displayProfile);

  useEffect(() => {
    gsap.to("#employer-progress-bar", {
      width: `${currentCompletion}%`, duration: 0.6, ease: "power2.out",
    });
  }, [currentCompletion]);

  // ── Edit controls ───────────────────────────────────────────────────────────

  function startEdit() {
    setDraft({ ...profile });
    setIsEditing(true);
  }

  async function saveEdit() {
    if (!authId) return;
    setProfile(draft);
    setIsEditing(false);
    dispatchEmployerNavAvatar(draft.avatarUrl, draft.name);

    const supabase = createClient();
    await supabase
      .from("employers")
      .update({
        name:       draft.name,
        venue_name: draft.venueName,
        venue_type: draft.venueType,
        location:   draft.location,
        phone:      draft.phone,
        email:      draft.email,
        bio:        draft.bio,
        avatar_url: draft.avatarUrl,
        website:    draft.website,
      })
      .eq("auth_id", authId);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  function setDraftField<K extends keyof EditableEmployerProfile>(
    key: K,
    value: EditableEmployerProfile[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">

      {/* Header */}
      <div className="gs-reveal mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              {displayProfile.avatarUrl ? (
                <img
                  src={displayProfile.avatarUrl}
                  alt={displayProfile.venueName || displayProfile.name}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-3xl">
                  {displayProfile.venueName
                    ? displayProfile.venueName[0].toUpperCase()
                    : displayProfile.name[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => {}}
                  className="absolute bottom-1 right-1 w-7 h-7 bg-[#111111] border-2 border-white rounded-full flex items-center justify-center"
                  title="Change photo"
                >
                  <i className="fa-solid fa-camera text-white text-[9px]"></i>
                </button>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={draft.venueName}
                    onChange={(e) => setDraftField("venueName", e.target.value)}
                    placeholder="Venue name (e.g. The Daily Grind)"
                    className={inputCls + " text-xl font-bold"}
                  />
                  <input
                    value={draft.name}
                    onChange={(e) => setDraftField("name", e.target.value)}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-1">
                    {profile.venueName || profile.name || "Your Venue"}
                  </h1>
                  {profile.venueName && (
                    <p className="text-gray-500">{profile.name}</p>
                  )}
                  {profile.venueType && (
                    <span className="mt-1 inline-block bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {profile.venueType}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEdit}
                  className="bg-white border border-gray-200 text-[#111111] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="bg-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-600 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={startEdit}
                className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2"
              >
                <i className="fa-solid fa-pen-to-square"></i> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Completeness bar */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-sm">Profile Completeness</h3>
              <span className="text-orange-600 font-bold text-sm">{currentCompletion}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                id="employer-progress-bar"
                className="h-full bg-orange-500 rounded-full"
                style={{ width: 0 }}
              ></div>
            </div>
          </div>
          <div className="text-sm text-gray-500 max-w-sm">
            Add your{" "}
            <button
              onClick={isEditing ? undefined : startEdit}
              className="text-[#111111] underline font-medium hover:text-orange-500"
            >
              venue details
            </button>{" "}
            to reach 100% and appear more trustworthy to workers.
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — About */}
        <div className="lg:col-span-2 space-y-8">

          {/* About the venue */}
          <div className={`bg-white rounded-3xl p-8 shadow-sm gs-reveal border ${isEditing ? "border-orange-200" : "border-[#EAEAEA]"}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fa-regular fa-building text-gray-400"></i> About the Venue
            </h2>
            {isEditing ? (
              <textarea
                value={draft.bio}
                onChange={(e) => setDraftField("bio", e.target.value)}
                rows={6}
                placeholder="Describe your venue, the team culture, what you're looking for in staff…"
                className={inputCls + " resize-none leading-relaxed"}
              />
            ) : (
              profile.bio
                ? <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>
                : <p className="text-sm text-gray-400 italic">No description yet — click Edit Profile to add one.</p>
            )}
          </div>
        </div>

        {/* Right sidebar — details */}
        <div className="space-y-8">

          {/* Venue details */}
          <div className={`bg-white rounded-3xl p-6 shadow-sm gs-reveal border ${isEditing ? "border-orange-200" : "border-[#EAEAEA]"}`}>
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-5">Venue Details</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Venue Type</label>
                  <select
                    value={draft.venueType}
                    onChange={(e) => setDraftField("venueType", e.target.value)}
                    className={inputCls + " appearance-none"}
                  >
                    <option value="">Select a type…</option>
                    {VENUE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input
                    value={draft.location}
                    onChange={(e) => setDraftField("location", e.target.value)}
                    placeholder="e.g. Fitzroy, VIC 3065"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(e) => setDraftField("phone", e.target.value)}
                    placeholder="03xx xxx xxx"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraftField("email", e.target.value)}
                    placeholder="hiring@venue.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Website</label>
                  <input
                    type="url"
                    value={draft.website}
                    onChange={(e) => setDraftField("website", e.target.value)}
                    placeholder="https://yourvenue.com.au"
                    className={inputCls}
                  />
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {[
                  { icon: "fa-solid fa-store",         label: "Type",     value: profile.venueType || "—" },
                  { icon: "fa-solid fa-location-dot",  label: "Location", value: profile.location  || "—" },
                  { icon: "fa-solid fa-phone",          label: "Phone",    value: profile.phone     || "—" },
                  { icon: "fa-solid fa-envelope",       label: "Email",    value: profile.email     || "—" },
                  { icon: "fa-solid fa-globe",          label: "Website",  value: profile.website   || "—" },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <i className={`${item.icon} text-gray-500 text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      {item.label === "Website" && profile.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-orange-600 hover:underline break-all"
                        >
                          {profile.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold break-all">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick tip */}
          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 gs-reveal">
            <div className="flex items-center gap-2 mb-3">
              <i className="fa-solid fa-bolt text-orange-500"></i>
              <h3 className="font-bold text-sm text-orange-800">Pro tip</h3>
            </div>
            <p className="text-xs text-orange-700 leading-relaxed">
              Workers are more likely to respond to venues with a complete profile. Add a bio and your venue type to stand out.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
