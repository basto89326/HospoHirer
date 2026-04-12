"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createClient } from "@/lib/supabase/browserClient";
import {
  dispatchWorkerNavAvatar,
  workerRowAvatarUrl,
} from "@/lib/workerNavAvatar";

// ─── Types ────────────────────────────────────────────────────────────────────

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

function calculateCompletion(p: EditableProfile, h: EditableEntry[]): number {
  if (p.name === "Loading...") return 0;
  let score = 0;
  if (p.name?.trim())               score += 10;
  if (p.headline?.trim())           score += 10;
  if (p.bio?.trim())                score += 20;
  if (p.location?.trim())           score += 10;
  if (p.roles?.length > 0)          score += 10;
  if (p.certifications?.length > 0) score += 20;
  if (h?.length > 0)                score += 20;
  return Math.min(100, score);
}

function emptyProfile(): EditableProfile {
  return {
    name:           "Loading...",
    headline:       "",
    bio:            "",
    location:       "",
    travelRadiusKm: 10,
    availability:   "Casual",
    phone:          "",
    email:          "",
    roles:          [],
    certifications: [],
    avatarUrl:      "",
  };
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white";
const labelCls =
  "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1";

const AVATAR_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET ?? "avatars";
const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_DATA_URL_FALLBACK_MAX = 800 * 1024;

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkerDashboard() {
  const [isEditing, setIsEditing]       = useState(false);
  const [authId, setAuthId]             = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarFileInputRef              = useRef<HTMLInputElement>(null);
  const [profile, setProfile]           = useState<EditableProfile>(emptyProfile());
  const [history, setHistory]           = useState<EditableEntry[]>([]);
  const [draft, setDraft]               = useState<EditableProfile>(emptyProfile());
  const [draftHistory, setDraftHistory] = useState<EditableEntry[]>([]);
  const [newRole, setNewRole]           = useState("");
  const [newCert, setNewCert]           = useState("");
  const entryCounter                    = useRef(0);

  // ── Load profile ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setAuthId(user.id);

      supabase
        .from("workers")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data) return;

          const loaded: EditableProfile = {
            name:           data.name          ?? "",
            headline:       data.mostRecentRole ?? "",
            bio:            data.bio            ?? "",
            location:       data.location       ?? "",
            travelRadiusKm: data.distanceKm     ?? 10,
            availability:   data.availability   ?? "Casual",
            phone:          data.phone          ?? "",
            email:          data.email          ?? "",
            roles:          data.roles          ?? [],
            certifications: (data.certifications ?? []).map(
              (c: string | { label: string; region: string }) =>
                typeof c === "string" ? { label: c, region: "" } : c
            ),
            avatarUrl:      workerRowAvatarUrl(data as Record<string, unknown>),
          };

          const lHistory: EditableEntry[] = (data.workHistory ?? []).map(
            (h: Omit<EditableEntry, "_key">, i: number) => ({ ...h, _key: i })
          );

          setProfile(loaded);
          setDraft(loaded);
          setHistory(lHistory);
          setDraftHistory(lHistory);
          entryCounter.current = lHistory.length;

          const navAvatar = workerRowAvatarUrl(data as Record<string, unknown>);
          if (navAvatar) dispatchWorkerNavAvatar(navAvatar);
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

  // ── Progress bar ──────────────────────────────────────────────────────────────

  const displayProfile    = isEditing ? draft    : profile;
  const displayHistory    = isEditing ? draftHistory : history;
  const currentCompletion = calculateCompletion(displayProfile, displayHistory);

  useEffect(() => {
    gsap.to("#progress-bar", {
      width: `${currentCompletion}%`, duration: 0.6, ease: "power2.out",
    });
  }, [currentCompletion]);

  // ── Edit controls ─────────────────────────────────────────────────────────────

  function startEdit() {
    setDraft({
      ...profile,
      roles:          profile.roles.map((r) => ({ ...r })),
      certifications: profile.certifications.map((c) => ({ ...c })),
    });
    setDraftHistory(history.map((e) => ({ ...e })));
    setNewRole("");
    setNewCert("");
    setIsEditing(true);
  }

  async function saveEdit() {
    if (!authId) return;
    setProfile(draft);
    setHistory(draftHistory);
    setIsEditing(false);

    const supabase = createClient();
    await supabase
      .from("workers")
      .update({
        name:            draft.name,
        location:        draft.location,
        distanceKm:      draft.travelRadiusKm,
        availability:    draft.availability,
        bio:             draft.bio,
        roles:           draft.roles,
        certifications:  draft.certifications.map((c) => c.label),
        workHistory:     draftHistory.map(({ _key, ...rest }) => rest),
        mostRecentRole:  draft.headline,
        mostRecentDates: draftHistory.find((e) => e.current)?.dates ?? "",
        avatarUrl:       draft.avatarUrl,
      })
      .eq("auth_id", authId);

    if (draft.avatarUrl?.trim()) {
      dispatchWorkerNavAvatar(draft.avatarUrl);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    dispatchWorkerNavAvatar(profile.avatarUrl ?? "");
  }

  // ── Draft helpers ─────────────────────────────────────────────────────────────

  function setDraftField<K extends keyof EditableProfile>(key: K, value: EditableProfile[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function addRole() {
    const trimmed = newRole.trim();
    if (!trimmed) return;
    setDraft((prev) => ({
      ...prev,
      roles: [...prev.roles, { label: trimmed, primary: prev.roles.length === 0 }],
    }));
    setNewRole("");
  }
  function removeRole(i: number) {
    setDraft((prev) => ({ ...prev, roles: prev.roles.filter((_, idx) => idx !== i) }));
  }
  function togglePrimary(i: number) {
    setDraft((prev) => ({
      ...prev,
      roles: prev.roles.map((r, idx) => ({ ...r, primary: idx === i })),
    }));
  }

  function addCert() {
    const trimmed = newCert.trim();
    if (!trimmed) return;
    setDraft((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { label: trimmed, region: "" }],
    }));
    setNewCert("");
  }
  function removeCert(i: number) {
    setDraft((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== i),
    }));
  }

  function addEntry() {
    const key = ++entryCounter.current;
    setDraftHistory((prev) => [
      { _key: key, title: "", place: "", dates: "", description: "", current: false },
      ...prev,
    ]);
  }
  function updateEntry(
    key: number,
    field: keyof Omit<EditableEntry, "_key">,
    value: string | boolean
  ) {
    setDraftHistory((prev) =>
      prev.map((e) => (e._key === key ? { ...e, [field]: value } : e))
    );
  }
  function removeEntry(key: number) {
    setDraftHistory((prev) => prev.filter((e) => e._key !== key));
  }

  async function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result ?? ""));
      r.onerror = () => reject(new Error("Could not read file"));
      r.readAsDataURL(file);
    });
  }

  async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !authId) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file (JPEG, PNG, GIF, or WebP).");
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      window.alert("Image must be 5MB or smaller.");
      return;
    }

    setAvatarUploading(true);
    const supabase = createClient();

    const ext =
      (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? ext : "jpg";
    const path = `workers/${authId}/avatar.${safeExt}`;

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || `image/${safeExt === "jpg" ? "jpeg" : safeExt}`,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
      const url = data.publicUrl;
      const busted = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
      setDraftField("avatarUrl", busted);
      dispatchWorkerNavAvatar(busted);
      setAvatarUploading(false);
      return;
    }

    if (file.size <= AVATAR_DATA_URL_FALLBACK_MAX) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setDraftField("avatarUrl", dataUrl);
        dispatchWorkerNavAvatar(dataUrl);
      } catch {
        window.alert(
          `Could not upload photo (${uploadError.message}).\n\n` +
            `Either create a public Storage bucket named "${AVATAR_BUCKET}" with upload access for signed-in users, ` +
            `or use a smaller image (under ${Math.round(AVATAR_DATA_URL_FALLBACK_MAX / 1024)}KB) to store it inline.`
        );
      }
    } else {
      window.alert(
        `Could not upload photo: ${uploadError.message}\n\n` +
          `Create a Storage bucket named "${AVATAR_BUCKET}" in Supabase (public read + authenticated upload), ` +
          `or use an image under ${Math.round(AVATAR_DATA_URL_FALLBACK_MAX / 1024)}KB.`
      );
    }
    setAvatarUploading(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <main className="pt-28 pb-20 max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="gs-reveal mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                aria-hidden
                onChange={handleAvatarFileChange}
              />
              <img
                src={displayProfile.avatarUrl || "https://i.pravatar.cc/150"}
                alt={displayProfile.name}
                className={`w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-md ${
                  avatarUploading ? "opacity-60" : ""
                }`}
              />
              {isEditing ? (
                <button
                  type="button"
                  disabled={avatarUploading || !authId}
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 w-7 h-7 bg-[#111111] border-2 border-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                  title="Change profile photo"
                >
                  {avatarUploading ? (
                    <i className="fa-solid fa-spinner fa-spin text-white text-[9px]" aria-label="Uploading" />
                  ) : (
                    <i className="fa-solid fa-camera text-white text-[9px]" />
                  )}
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
              <span className="text-orange-600 font-bold text-sm">{currentCompletion}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div id="progress-bar" className="h-full bg-orange-500 rounded-full" style={{ width: 0 }}></div>
            </div>
          </div>
          <div className="text-sm text-gray-500 max-w-sm">
            Add your{" "}
            <button
              onClick={isEditing ? undefined : startEdit}
              className="text-[#111111] underline font-medium hover:text-orange-500"
            >
              certifications
            </button>{" "}
            (like RSA or Food Safety) to reach 100% and stand out to more employers.
          </div>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">

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
              profile.bio
                ? <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>
                : <p className="text-sm text-gray-400 italic">No bio yet — click Edit Profile to add one.</p>
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
                  <p className="text-sm text-gray-400 text-center py-6">
                    No work history yet. Click &ldquo;Add Role&rdquo; to get started.
                  </p>
                )}
              </div>
            ) : (
              <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
                {displayHistory.length === 0
                  ? <p className="text-sm text-gray-400 italic pl-6">No work history added yet.</p>
                  : displayHistory.map((item) => (
                    <div key={item._key} className="relative pl-6">
                      <div className={`absolute w-3 h-3 bg-white rounded-full -left-[6.5px] top-1.5 ${item.current ? "border-2 border-[#111111]" : "border-2 border-gray-300"}`}></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                        <h3 className="font-bold text-base">{item.title}</h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md mt-1 sm:mt-0">{item.dates}</span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">{item.place}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">

          {/* Worker details */}
          <div className={`bg-white rounded-3xl p-6 shadow-sm gs-reveal border ${isEditing ? "border-orange-200" : "border-[#EAEAEA]"}`}>
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-5">Worker Details</h3>
            {isEditing ? (
              <div className="space-y-4">
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
                  <select
                    value={draft.availability}
                    onChange={(e) => setDraftField("availability", e.target.value)}
                    className={inputCls + " appearance-none"}
                  >
                    <option>Both (Weekdays &amp; Weekends)</option>
                    <option>Weekdays only</option>
                    <option>Weekends only</option>
                    <option>Casual</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(e) => setDraftField("phone", e.target.value)}
                    placeholder="04xx xxx xxx"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraftField("email", e.target.value)}
                    placeholder="you@email.com"
                    className={inputCls}
                  />
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {[
                  { icon: "fa-solid fa-location-dot",    label: "Location",     value: profile.location     || "—" },
                  { icon: "fa-solid fa-route",           label: "Travel",       value: `${profile.travelRadiusKm}km radius` },
                  { icon: "fa-regular fa-calendar-check",label: "Availability", value: profile.availability || "—" },
                  { icon: "fa-solid fa-phone",           label: "Phone",        value: profile.phone        || "—" },
                  { icon: "fa-solid fa-envelope",        label: "Email",        value: profile.email        || "—" },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <i className={`${item.icon} text-gray-500 text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Job preferences / roles */}
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
                  <button
                    onClick={addRole}
                    className="bg-[#111111] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition"
                  >
                    Add
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">Click a tag to set it as your primary role.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.roles.length === 0
                  ? <p className="text-sm text-gray-400 italic">No roles added yet.</p>
                  : profile.roles.map((r) => (
                    <span
                      key={r.label}
                      className={
                        r.primary
                          ? "bg-orange-50 border border-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold"
                          : "bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold"
                      }
                    >
                      {r.label}
                    </span>
                  ))
                }
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
                          const updated = draft.certifications.map((c, ci) =>
                            ci === i ? { ...c, label: e.target.value } : c
                          );
                          setDraftField("certifications", updated);
                        }}
                        placeholder="e.g. RSA"
                        className="w-full text-sm font-bold bg-transparent outline-none border-b border-gray-200 focus:border-orange-400 pb-0.5"
                      />
                      <input
                        value={cert.region}
                        onChange={(e) => {
                          const updated = draft.certifications.map((c, ci) =>
                            ci === i ? { ...c, region: e.target.value } : c
                          );
                          setDraftField("certifications", updated);
                        }}
                        placeholder="Region (optional)"
                        className="w-full text-[10px] text-gray-500 bg-transparent outline-none mt-0.5"
                      />
                    </div>
                    <button
                      onClick={() => removeCert(i)}
                      className="text-gray-400 hover:text-red-500 transition shrink-0"
                    >
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
                  <button
                    onClick={addCert}
                    className="bg-[#111111] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <>
                {profile.certifications.length === 0
                  ? <p className="text-sm text-gray-400 italic mb-3">No certifications added yet.</p>
                  : profile.certifications.map((cert) => (
                    <div key={cert.label} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 mb-3">
                      <i className="fa-solid fa-certificate text-orange-400"></i>
                      <div>
                        <p className="text-sm font-bold">{cert.label}</p>
                        {cert.region && <p className="text-[10px] text-gray-500">{cert.region}</p>}
                      </div>
                    </div>
                  ))
                }
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
