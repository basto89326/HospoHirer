"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { type EmployerEnquiry, type ProfileView } from "@/lib/types";
import { createClient } from "@/lib/supabase/browserClient";

// ─── Local edit types ─────────────────────────────────────────────────────────

interface EditableProfile {
  name: string;
  headline: string;
  bio: string;
  location: string;
  travelRadiusKm: number;
  availability: string;
  phone: string;
  email: string;
  roles: { label: string; primary: boolean }[];
  certifications: { label: string; region: string }[];
  avatarUrl: string;
  profileCompletion: number;
}

interface EditableEntry {
  _key: number;
  title: string;
  place: string;
  dates: string;
  description: string;
  current: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Shared UI constants ────────────────────────────────────────────────────────

const mockWorkerStats = [
  { label: "Profile Views", value: "34", sub: "+5 this week", icon: "fa-solid fa-eye", color: "text-blue-500" },
  { label: "Enquiries", value: "8", sub: "2 unread", icon: "fa-solid fa-envelope", color: "text-green-500" },
  { label: "Search Appearances", value: "156", sub: "+24 this week", icon: "fa-solid fa-magnifying-glass", color: "text-purple-500" },
  { label: "Response Rate", value: "95%", sub: "Top 10%", icon: "fa-solid fa-bolt", color: "text-orange-500" },
];

function createEmptyProfile(): EditableProfile {
  return {
    name: "Loading...",
    headline: "",
    bio: "",
    location: "",
    travelRadiusKm: 5,
    availability: "Casual",
    phone: "0400 000 000",
    email: "worker@email.com",
    roles: [],
    certifications: [],
    avatarUrl: "https://i.pravatar.cc/150",
    profileCompletion: 85,
  };
}

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white";

const labelCls = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1";

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkerDashboard() {
  const [isEditing, setIsEditing] = useState(false);

  // Saved (committed) state
  const [profile, setProfile] = useState<EditableProfile>(createEmptyProfile);
  const [history, setHistory] = useState<EditableEntry[]>([]);
  const [enquiries, setEnquiries] = useState<EmployerEnquiry[]>([]);
  const [profileViews, setProfileViews] = useState<ProfileView[]>([]);

  // Draft state — only active while editing
  const [draft, setDraft] = useState<EditableProfile>(profile);
  const [draftHistory, setDraftHistory] = useState<EditableEntry[]>(history);
  const [newRole, setNewRole] = useState("");
  const [newCert, setNewCert] = useState("");
  const entryCounter = useRef(history.length);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.from("workers").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) {
        const loadedProfile: EditableProfile = {
          name: data.name,
          headline: data.mostRecentRole || "Professional",
          bio: data.bio || "",
          location: data.location,
          travelRadiusKm: data.distanceKm || 5,
          availability: data.availability,
          phone: "0400 000 000",
          email: "worker@email.com",
          roles: data.roles || [],
          certifications: (data.certifications || []).map((c: string) => ({ label: c, region: "Victoria" })),
          avatarUrl: data.avatarUrl || "https://i.pravatar.cc/150",
          profileCompletion: 85
        };
        setProfile(loadedProfile);
        setDraft(loadedProfile);
        const lHistory = (data.workHistory || []).map((h: any, i: number) => ({ ...h, _key: i }));
        setHistory(lHistory);
        setDraftHistory(lHistory);
        entryCounter.current = lHistory.length;
        gsap.fromTo("#progress-bar", { width: "0%" }, { width: `85%`, duration: 1, ease: "power3.out", delay: 0.3 });
      }
    });

    supabase.from("enquiries").select("*").then(({ data }) => setEnquiries(data as EmployerEnquiry[] || []));
    supabase.from("profile_views").select("*").then(({ data }) => setProfileViews(data as ProfileView[] || []));

        const ctx = gsap.context(() => {
      gsap.from(".gs-reveal", { y: 10, opacity: 0, duration: 0.3, stagger: 0.04, ease: "power2.out", clearProps: "opacity,transform" });
      });
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Edit controls ────────────────────────────────────────────────────────────

  function startEdit() {
    setDraft({ ...profile, roles: profile.roles.map((r) => ({ ...r })), certifications: profile.certifications.map((c) => ({ ...c })) });
    setDraftHistory(history.map((e) => ({ ...e })));
    setNewRole("");
    setNewCert("");
    setIsEditing(true);
  }

  async function saveEdit() {
    setProfile(draft);
    setHistory(draftHistory);
    setIsEditing(false);

    const supabase = createClient();
    const updatedWorker = {
      name: draft.name,
      location: draft.location,
      "distanceKm": draft.travelRadiusKm,
      availability: draft.availability,
      bio: draft.bio,
      roles: draft.roles,
      certifications: draft.certifications.map(c => c.label), 
      "workHistory": draftHistory,
    };
    
    // In a real app we'd update by Auth ID, but for the MVP we update Marcus L. (ID 1)
    await supabase.from("workers").update(updatedWorker).eq("id", 1);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  // ── Draft field helpers ───────────────────────────────────────────────────────

  function setDraftField<K extends keyof EditableProfile>(key: K, value: EditableProfile[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  // Roles
  function addRole() {
    const trimmed = newRole.trim();
    if (!trimmed) return;
    setDraft((prev) => ({ ...prev, roles: [...prev.roles, { label: trimmed, primary: false }] }));
    setNewRole("");
  }
  function removeRole(index: number) {
    setDraft((prev) => ({ ...prev, roles: prev.roles.filter((_, i) => i !== index) }));
  }
  function togglePrimary(index: number) {
    setDraft((prev) => ({
      ...prev,
      roles: prev.roles.map((r, i) => ({ ...r, primary: i === index })),
    }));
  }

  // Certifications
  function addCert() {
    const trimmed = newCert.trim();
    if (!trimmed) return;
    setDraft((prev) => ({ ...prev, certifications: [...prev.certifications, { label: trimmed, region: "Victoria" }] }));
    setNewCert("");
  }
  function removeCert(index: number) {
    setDraft((prev) => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));
  }

  // Work history
  function updateEntry(key: number, field: keyof Omit<EditableEntry, "_key">, value: string | boolean) {
    setDraftHistory((prev) =>
      prev.map((e) => (e._key === key ? { ...e, [field]: value } : e))
    );
  }
  function removeEntry(key: number) {
    setDraftHistory((prev) => prev.filter((e) => e._key !== key));
  }
  function addEntry() {
    const key = ++entryCounter.current;
    setDraftHistory((prev) => [
      { _key: key, title: "", place: "", dates: "", description: "", current: false },
      ...prev,
    ]);
  }

  // ── Render helpers ────────────────────────────────────────────────────────────

  const displayProfile = isEditing ? draft : profile;
  const displayHistory = isEditing ? draftHistory : history;

  return (
    <main className="pt-28 pb-20 max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="gs-reveal mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={displayProfile.avatarUrl}
                alt={displayProfile.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              {isEditing ? (
                <button
                  onClick={() => {}}
                  className="absolute bottom-1 right-1 w-7 h-7 bg-[#111111] border-2 border-white rounded-full flex items-center justify-center"
                  title="Change photo"
                >
                  <i className="fa-solid fa-camera text-white text-[9px]"></i>
                </button>
              ) : (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Online"></div>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={draft.name}
                    onChange={(e) => setDraftField("name", e.target.value)}
                    placeholder="Full name"
                    className={inputCls + " text-xl font-bold"}
                  />
                  <input
                    value={draft.headline}
                    onChange={(e) => setDraftField("headline", e.target.value)}
                    placeholder="e.g. Head Barista & Cafe Manager"
                    className={inputCls}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center text-[10px] uppercase tracking-wider font-bold gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Visible to employers
                    </span>
                  </div>
                  <p className="text-gray-500">{profile.headline}</p>
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
              <>
                <button className="bg-white border border-gray-200 text-[#111111] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                  <i className="fa-solid fa-share-nodes"></i> Share Profile
                </button>
                <button
                  onClick={startEdit}
                  className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                </button>
              </>
            )}
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
              <div id="progress-bar" className="h-full bg-orange-500 rounded-full" style={{ width: 0 }}></div>
            </div>
          </div>
          <div className="text-sm text-gray-500 max-w-sm">
            Add your{" "}
            <button onClick={isEditing ? undefined : startEdit} className="text-[#111111] underline font-medium hover:text-orange-500">
              certifications
            </button>{" "}
            (like RSA or Food Safety) to reach 100% and stand out to more employers.
          </div>
        </div>
      </div>

      {/* Stats row — always visible, not editable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 gs-reveal">
        {mockWorkerStats.map((stat) => (
          <div key={stat.label} className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <i className={`${stat.icon} ${stat.color} text-sm`}></i>
              </div>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold leading-none">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Enquiries — hidden while editing */}
          {!isEditing && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-8 shadow-sm gs-reveal">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-gray-400"></i> Enquiries
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                    {enquiries.filter((e) => !e.read).length} new
                  </span>
                </h2>
              </div>
              <div className="space-y-4">
                {enquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className={`flex gap-4 p-4 rounded-2xl border transition cursor-pointer hover:shadow-sm ${
                      enquiry.read ? "border-gray-100 bg-gray-50/50" : "border-orange-100 bg-orange-50/40"
                    }`}
                  >
                    <img src={enquiry.avatarUrl} alt={enquiry.contactName} className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <div>
                          <span className="font-bold text-sm">{enquiry.venueName}</span>
                          <span className="text-xs text-gray-400 ml-1.5">· {enquiry.venueLocation}</span>
                          {!enquiry.read && <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full inline-block align-middle"></span>}
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{enquiry.sentAt}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{enquiry.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Summary */}
          <div className={`bg-white rounded-3xl p-8 shadow-sm gs-reveal border ${isEditing ? "border-orange-200" : "border-[#EAEAEA]"}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fa-regular fa-user text-gray-400"></i> Experience Summary
            </h2>
            {isEditing ? (
              <textarea
                value={draft.bio}
                onChange={(e) => setDraftField("bio", e.target.value)}
                rows={6}
                placeholder="Describe your experience, skills, and what you're looking for…"
                className={inputCls + " resize-none leading-relaxed"}
              />
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>
            )}
          </div>

          {/* Work History */}
          <div className={`bg-white rounded-3xl p-8 shadow-sm gs-reveal border ${isEditing ? "border-orange-200" : "border-[#EAEAEA]"}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-gray-400"></i> Work History
              </h2>
              {isEditing && (
                <button
                  onClick={addEntry}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 transition flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i> Add Role
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-5">
                {draftHistory.map((entry) => (
                  <div key={entry._key} className="border border-gray-200 rounded-2xl p-5 space-y-3 bg-gray-50/50">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={entry.current}
                          onChange={(e) => updateEntry(entry._key, "current", e.target.checked)}
                          className="accent-orange-500 w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-gray-600">Current role</span>
                      </label>
                      <button
                        onClick={() => removeEntry(entry._key)}
                        className="text-gray-400 hover:text-red-500 transition"
                        title="Remove"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Job Title</label>
                        <input
                          value={entry.title}
                          onChange={(e) => updateEntry(entry._key, "title", e.target.value)}
                          placeholder="e.g. Head Barista"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Venue & Location</label>
                        <input
                          value={entry.place}
                          onChange={(e) => updateEntry(entry._key, "place", e.target.value)}
                          placeholder="e.g. The Daily Grind, Fitzroy"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Dates</label>
                      <input
                        value={entry.dates}
                        onChange={(e) => updateEntry(entry._key, "dates", e.target.value)}
                        placeholder="e.g. Aug 2021 – Present"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        value={entry.description}
                        onChange={(e) => updateEntry(entry._key, "description", e.target.value)}
                        rows={2}
                        placeholder="Briefly describe your responsibilities…"
                        className={inputCls + " resize-none"}
                      />
                    </div>
                  </div>
                ))}
                {draftHistory.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">No work history yet. Click "Add Role" to get started.</p>
                )}
              </div>
            ) : (
              <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
                {displayHistory.map((item) => (
                  <div key={item._key} className="relative pl-6">
                    <div className={`absolute w-3 h-3 bg-white rounded-full -left-[6.5px] top-1.5 ${item.current ? "border-2 border-[#111111]" : "border-2 border-gray-300"}`}></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                      <h3 className="font-bold text-base">{item.title}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md mt-1 sm:mt-0">{item.dates}</span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{item.place}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">

          {/* Profile views — hidden while editing */}
          {!isEditing && (
            <div className="bg-white border border-[#EAEAEA] rounded-3xl p-6 shadow-sm gs-reveal">
              <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-5">Recent Profile Views</h3>
              <div className="space-y-4">
                {profileViews.map((view) => (
                  <div key={view.id} className="flex items-center gap-3">
                    <img src={view.avatarUrl} alt={view.venueName} className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{view.venueName}</p>
                      <p className="text-xs text-gray-500 truncate">{view.venueType} · {view.location}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{view.viewedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worker details */}
          <div className={`bg-white rounded-3xl p-6 shadow-sm gs-reveal border ${isEditing ? "border-orange-200" : "border-[#EAEAEA]"}`}>
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-5">Worker Details</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Location</label>
                  <input value={draft.location} onChange={(e) => setDraftField("location", e.target.value)} placeholder="e.g. Fitzroy, VIC 3065" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Travel Radius (km)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={draft.travelRadiusKm}
                    onChange={(e) => setDraftField("travelRadiusKm", Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Availability</label>
                  <select value={draft.availability} onChange={(e) => setDraftField("availability", e.target.value)} className={inputCls + " appearance-none"}>
                    <option>Both (Weekdays &amp; Weekends)</option>
                    <option>Weekdays only</option>
                    <option>Weekends only</option>
                    <option>Casual</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" value={draft.phone} onChange={(e) => setDraftField("phone", e.target.value)} placeholder="04xx xxx xxx" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={draft.email} onChange={(e) => setDraftField("email", e.target.value)} placeholder="you@email.com" className={inputCls} />
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {[
                  { icon: "fa-solid fa-location-dot", label: "Location", value: profile.location },
                  { icon: "fa-solid fa-route", label: "Travel Radius", value: `${profile.travelRadiusKm}km` },
                  { icon: "fa-regular fa-calendar-check", label: "Availability", value: profile.availability },
                  { icon: "fa-solid fa-phone", label: "Phone", value: profile.phone, sub: profile.email },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <i className={`${item.icon} text-gray-500 text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                      {"sub" in item && item.sub && <p className="text-xs text-gray-500">{item.sub}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Job preferences */}
          <div className={`bg-white rounded-3xl p-6 shadow-sm gs-reveal border ${isEditing ? "border-orange-200" : "border-[#EAEAEA]"}`}>
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Job Preferences</h3>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {draft.roles.map((role, i) => (
                    <span
                      key={i}
                      onClick={() => togglePrimary(i)}
                      title="Click to set as primary"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                        role.primary
                          ? "bg-orange-50 border border-orange-200 text-orange-700"
                          : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-orange-200"
                      }`}
                    >
                      {role.primary && <i className="fa-solid fa-star text-[9px]"></i>}
                      {role.label}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeRole(i); }}
                        className="ml-0.5 text-gray-400 hover:text-red-500 transition"
                      >
                        <i className="fa-solid fa-xmark text-[10px]"></i>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addRole()}
                    placeholder="Add a role…"
                    className={inputCls + " flex-1"}
                  />
                  <button onClick={addRole} className="bg-[#111111] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition">
                    Add
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">Click a tag to set it as your primary role.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.roles.map((pref) => (
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
            )}
          </div>

          {/* Certifications */}
          <div className={`bg-white rounded-3xl p-6 shadow-sm gs-reveal border ${isEditing ? "border-orange-200" : "border-[#EAEAEA]"}`}>
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Certifications</h3>
            {isEditing ? (
              <div className="space-y-3">
                {draft.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <i className="fa-solid fa-certificate text-orange-400 shrink-0"></i>
                    <div className="flex-1 min-w-0">
                      <input
                        value={cert.label}
                        onChange={(e) => {
                          const updated = draft.certifications.map((c, ci) => ci === i ? { ...c, label: e.target.value } : c);
                          setDraftField("certifications", updated);
                        }}
                        placeholder="e.g. RSA"
                        className="w-full text-sm font-bold bg-transparent outline-none border-b border-gray-200 focus:border-orange-400 pb-0.5"
                      />
                      <input
                        value={cert.region}
                        onChange={(e) => {
                          const updated = draft.certifications.map((c, ci) => ci === i ? { ...c, region: e.target.value } : c);
                          setDraftField("certifications", updated);
                        }}
                        placeholder="Region"
                        className="w-full text-[10px] text-gray-500 bg-transparent outline-none mt-0.5"
                      />
                    </div>
                    <button onClick={() => removeCert(i)} className="text-gray-400 hover:text-red-500 transition shrink-0">
                      <i className="fa-solid fa-xmark text-sm"></i>
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCert()}
                    placeholder="e.g. Food Safety Supervisor"
                    className={inputCls + " flex-1"}
                  />
                  <button onClick={addCert} className="bg-[#111111] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition">
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <>
                {profile.certifications.map((cert) => (
                  <div key={cert.label} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 mb-3">
                    <i className="fa-solid fa-certificate text-orange-400"></i>
                    <div>
                      <p className="text-sm font-bold">{cert.label}</p>
                      <p className="text-[10px] text-gray-500">{cert.region} · Valid</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={startEdit}
                  className="w-full p-3 rounded-xl border border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <span className="text-xs text-gray-500 font-medium">+ Add Certification</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
