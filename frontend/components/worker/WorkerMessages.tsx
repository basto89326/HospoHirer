"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { mockWorkerConversations, type Conversation } from "@/lib/mockData";

export default function WorkerMessages() {
  const [conversations, setConversations] = useState(mockWorkerConversations);
  const [selected, setSelected] = useState<Conversation>(conversations[0]);
  const [draft, setDraft] = useState("");
  const [showThread, setShowThread] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selected]);

  function openConversation(conv: Conversation) {
    setSelected(conv);
    setShowThread(true);
    // mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: false } : c))
    );
  }

  function sendMessage() {
    if (!draft.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: "me" as const,
      text: draft.trim(),
      sentAt: "Just now",
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, lastAt: "Just now" }
          : c
      )
    );
    setSelected((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
    setDraft("");
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
        <p className="text-sm text-gray-500 mt-1">Your conversations with employers</p>
      </div>

      <div className="gs-reveal bg-white border border-[#EAEAEA] rounded-3xl shadow-sm overflow-hidden flex h-[calc(100vh-220px)] min-h-[480px]">
        {/* Conversation list */}
        <div
          className={`w-full md:w-80 md:block border-r border-[#EAEAEA] flex-shrink-0 overflow-y-auto ${
            showThread ? "hidden md:block" : "block"
          }`}
        >
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv)}
              className={`w-full text-left flex items-start gap-3 px-4 py-4 border-b border-[#EAEAEA] hover:bg-gray-50/80 transition ${
                selected.id === conv.id ? "bg-orange-50/60" : ""
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={conv.avatarUrl}
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
                  <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{conv.lastAt}</span>
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
          ))}
        </div>

        {/* Thread panel */}
        <div className={`flex-1 flex flex-col min-w-0 ${showThread ? "flex" : "hidden md:flex"}`}>
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
                src={selected.avatarUrl}
                alt={selected.name}
                className="w-9 h-9 rounded-full object-cover border border-gray-100"
              />
              {selected.online && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">{selected.name}</p>
              <p className="text-xs text-gray-500">{selected.subtitle}</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-gray-50/40">
            {selected.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "me"
                      ? "bg-[#111111] text-white rounded-br-sm"
                      : "bg-white border border-[#EAEAEA] text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === "me" ? "text-gray-400" : "text-gray-400"}`}>
                    {msg.sentAt}
                  </p>
                </div>
              </div>
            ))}
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
              disabled={!draft.trim()}
              className="bg-[#111111] text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-40 shrink-0"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
