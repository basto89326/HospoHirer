"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { type Conversation, type ChatMessage } from "@/lib/types";
import { createClient } from "@/lib/supabase/browserClient";
import WorkerProfileModal from "@/components/worker/WorkerProfileModal";

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

export default function EmployerMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [draft, setDraft] = useState("");
  const [showThread, setShowThread] = useState(false);
  const [viewingWorkerId, setViewingWorkerId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const supabase = createClient();

  const filteredConversations = conversations.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const authId = user.id;

      supabase
        .from("conversations")
        .select("*")
        .eq("employer_auth_id", authId)
        .order("id", { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setConversations(data as Conversation[]);
            // Pre-select conv from URL param if present, otherwise first
            const convParam = searchParams.get("conv");
            const target = convParam
              ? (data as Conversation[]).find((c) => String(c.id) === convParam)
              : null;
            setSelected((target ?? data[0]) as Conversation);
            if (target) setShowThread(true);
          }
        });

      channel = supabase
        .channel("conversations-employer")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "conversations",
            filter: `employer_auth_id=eq.${authId}`,
          },
          (payload) => {
            const updated = payload.new as Conversation;
            setConversations((prev) =>
              prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
            );
            setSelected((prev) =>
              prev?.id === updated.id ? { ...prev, ...updated } : prev
            );
          }
        )
        .subscribe();
    });

    const ctx = gsap.context(() => {
      gsap.from(".gs-reveal", {
        y: 10, opacity: 0, duration: 0.3, stagger: 0.04, ease: "power2.out",
        clearProps: "opacity,transform",
      });
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selected?.messages]);

  function openConversation(conv: Conversation) {
    setSelected(conv);
    setShowThread(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: false } : c))
    );
  }

  // Resolve direction: employer sent = "me", worker sent = "them"
  function resolveDirection(msg: ChatMessage): "me" | "them" {
    // Support legacy "me"/"them" direction AND new "employer"/"worker" sender types
    if (msg.from === "employer") return "me";
    if (msg.from === "worker") return "them";
    return msg.from as "me" | "them";
  }

  async function sendMessage() {
    if (!draft.trim() || !selected || sending) return;
    setSending(true);
    const now = new Date();
    const newMsg: ChatMessage = {
      id: Date.now(),
      from: "employer",
      text: draft.trim(),
      sentAt: now.toISOString(),
    };
    const updatedMessages = [...selected.messages, newMsg];
    setDraft("");

    const { error } = await supabase
      .from("conversations")
      .update({
        messages: updatedMessages,
        lastMessage: newMsg.text,
        lastAt: now.toISOString(),
      })
      .eq("id", selected.id);

    setSending(false);
    if (error) {
      console.error("Failed to send message:", error.message);
      return;
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: updatedMessages, lastMessage: newMsg.text, lastAt: now.toISOString() }
          : c
      )
    );
    setSelected((prev) => (prev ? { ...prev, messages: updatedMessages } : null));
  }

  const totalUnread = conversations.filter((c) => c.unread).length;

  return (
    <main className="pt-24 pb-10 max-w-6xl mx-auto px-4 md:px-6">
      {/* Page heading */}
      <div className="mb-6 gs-reveal">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-envelope text-gray-400"></i> Messages
          {totalUnread > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {totalUnread} new
            </span>
          )}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Your conversations with workers</p>
      </div>

      <div className="gs-reveal bg-white border border-[#EAEAEA] rounded-3xl shadow-sm overflow-hidden flex h-[calc(100vh-220px)] min-h-[480px]">
        {/* Conversation list */}
        <div
          className={`w-full md:w-80 md:block border-r border-[#EAEAEA] flex-shrink-0 flex flex-col ${
            showThread ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="p-3 border-b border-[#EAEAEA]">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-[#EAEAEA] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 px-4 text-center">
                <i className="fa-regular fa-envelope text-3xl mb-3 block"></i>
                <p className="text-sm">
                  {search ? `No conversations match "${search}"` : "No conversations yet"}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-4 border-b border-[#EAEAEA] hover:bg-gray-50/80 transition ${
                    selected?.id === conv.id ? "bg-orange-50/60" : ""
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatarUrl || "https://i.pravatar.cc/150"}
                      alt={conv.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-100"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <span className={`text-sm font-semibold truncate ${conv.unread ? "text-[#111111]" : "text-gray-700"}`}>
                        {conv.name}
                      </span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                        {conv.lastAt ? formatTime(new Date(conv.lastAt)) : ""}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.subtitle}</p>
                    <p className={`text-xs truncate mt-0.5 ${conv.unread ? "text-[#111111] font-medium" : "text-gray-400"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <span className="mt-1 w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread panel */}
        <div className={`flex-1 flex flex-col min-w-0 ${showThread ? "flex" : "hidden md:flex"}`}>
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <i className="fa-regular fa-comment-dots text-4xl"></i>
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#EAEAEA] bg-white">
                <button
                  className="md:hidden text-gray-500 hover:text-[#111111] mr-1"
                  onClick={() => setShowThread(false)}
                >
                  <i className="fa-solid fa-arrow-left text-sm"></i>
                </button>
                <div className="relative">
                  <img
                    src={selected.avatarUrl || "https://i.pravatar.cc/150"}
                    alt={selected.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                  />
                  {selected.online && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight">{selected.name}</p>
                  <p className="text-xs text-gray-500">
                    {selected.subtitle}
                    {selected.location ? ` · ${selected.location}` : ""}
                    {selected.online
                      ? <span className="text-green-500 ml-1">● Online</span>
                      : null}
                  </p>
                </div>
                {selected.worker_auth_id && (
                  <button
                    onClick={() => setViewingWorkerId(selected.worker_auth_id!)}
                    className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#111111] transition border border-gray-200 px-3 py-1.5 rounded-full"
                  >
                    <i className="fa-regular fa-user text-[11px]"></i> View Profile
                  </button>
                )}
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-gray-50/40">
                {selected.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <i className="fa-regular fa-comment text-3xl"></i>
                    <p className="text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  selected.messages.map((msg) => {
                    const direction = resolveDirection(msg);
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${direction === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            direction === "me"
                              ? "bg-[#111111] text-white rounded-br-sm"
                              : "bg-white border border-[#EAEAEA] text-gray-800 rounded-bl-sm shadow-sm"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-[10px] mt-1 opacity-60">
                            {msg.sentAt
                              ? (isNaN(Date.parse(msg.sentAt))
                                ? msg.sentAt
                                : formatTime(new Date(msg.sentAt)))
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Compose bar */}
              <div className="px-4 py-3 border-t border-[#EAEAEA] bg-white flex items-end gap-3">
                <textarea
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Write a message..."
                  className="flex-1 resize-none bg-gray-50 border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition"
                />
                <button
                  onClick={sendMessage}
                  disabled={!draft.trim() || sending}
                  className="bg-[#111111] text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-40 shrink-0"
                >
                  <i className={`fa-solid ${sending ? "fa-spinner fa-spin" : "fa-paper-plane"} text-sm`}></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {viewingWorkerId && (
        <WorkerProfileModal
          workerAuthId={viewingWorkerId}
          onClose={() => setViewingWorkerId(null)}
        />
      )}
    </main>
  );
}
