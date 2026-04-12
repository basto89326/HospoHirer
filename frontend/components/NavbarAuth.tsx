"use client";

import { useEffect, useState } from "react";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/browserClient";
import {
  WORKER_NAV_AVATAR_EVENT,
  workerRowAvatarUrl,
  type WorkerNavAvatarDetail,
} from "@/lib/workerNavAvatar";

interface NavbarAuthProps {
  type: "employer" | "worker";
}

export default function NavbarAuth({ type }: NavbarAuthProps) {
  const [workerAvatarUrl, setWorkerAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (type !== "worker") return;

    const supabase = createClient();

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("workers")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (!data) return;
      const url = workerRowAvatarUrl(data as Record<string, unknown>);
      if (url) setWorkerAvatarUrl(url);
    })();

    function onAvatar(e: Event) {
      const ce = e as CustomEvent<WorkerNavAvatarDetail>;
      const url = ce.detail?.url?.trim() ?? "";
      setWorkerAvatarUrl(url ? url : null);
    }
    window.addEventListener(WORKER_NAV_AVATAR_EVENT, onAvatar);
    return () => window.removeEventListener(WORKER_NAV_AVATAR_EVENT, onAvatar);
  }, [type]);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 font-bold text-xl">
          <i className="fa-solid fa-utensils"></i>
          <span>HospoHirer</span>
        </a>

        {type === "employer" ? (
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="/employer" className="hover:text-[#111111] transition">
              Find Staff
            </a>
            <a href="/employer/saved" className="hover:text-[#111111] transition">
              Saved Profiles
            </a>
            <a href="/employer/messages" className="hover:text-[#111111] transition">
              Messages
            </a>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="/worker" className="hover:text-[#111111] transition">
              Dashboard
            </a>
            <a href="/worker/messages" className="hover:text-[#111111] transition">
              Messages
            </a>
          </div>
        )}

        <div className="flex items-center gap-3">
          {type === "employer" ? (
            <div className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer shadow-sm bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              DG
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm shrink-0 bg-gray-50">
              <img
                src={workerAvatarUrl || "https://i.pravatar.cc/150"}
                alt="Your profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-gray-500 hover:text-[#111111] transition"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
