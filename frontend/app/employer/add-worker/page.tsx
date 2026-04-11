"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browserClient";
import { useRouter } from "next/navigation";

export default function AddWorkerPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Barista");
  const [location, setLocation] = useState("Melbourne CBD");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const newWorker = {
      name,
      location,
      distanceKm: 5,
      availability: "Casual",
      availabilityColor: "bg-blue-100 text-blue-700",
      avatarUrl: "https://i.pravatar.cc/150?u=" + Date.now(),
      online: true,
      mostRecentRole: role + " @ Some Cafe",
      mostRecentDates: "Just now",
      bio: "A brand new worker added directly to the Supabase database!",
      roles: [{ label: role, primary: true }],
      certifications: ["Food Handler Certificate"],
      workHistory: [],
    };

    const { error } = await supabase.from("workers").insert([newWorker]);
    setLoading(false);

    if (error) {
      alert("Error adding worker: " + error.message);
    } else {
      alert("Worker added successfully to Supabase!");
      router.push("/employer");
    }
  }

  return (
    <main className="pt-28 pb-20 max-w-xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-8">Add a New Worker</h1>
      
      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Worker Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Primary Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 appearance-none"
          >
            <option>Barista</option>
            <option>Head Chef</option>
            <option>Wait Staff</option>
            <option>Bartender</option>
            <option>Venue Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
            placeholder="e.g. Richmond"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#111111] text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Adding to Database..." : "Add to Database"}
        </button>
      </form>
    </main>
  );
}
