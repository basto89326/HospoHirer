"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const faqs = [
  {
    question: "Do employers need to post a job?",
    answer:
      "No. There are no job boards or listings. Employers search the live directory, filter by suburb, role, and availability, and reach out to workers directly.",
  },
  {
    question: "Is it free for workers?",
    answer:
      "Yes. Creating a profile, listing your availability, and receiving enquiries from employers is completely free for workers.",
  },
  {
    question: "How do employers contact me?",
    answer:
      "Once an employer creates an account, they can view your full profile — including your phone number and email — and message you directly through the platform.",
  },
  {
    question: "What goes on a worker profile?",
    answer:
      "Your profile includes a headline, bio, work history timeline, job preferences (e.g. Barista, Head Chef), certifications like RSA or Food Safety Supervisor, your suburb, and a travel radius so employers know how far you'll travel.",
  },
];

export default function FaqAndSignup() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".faq-section", {
        scrollTrigger: {
          trigger: ".faq-section",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="signup" className="faq-section max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* FAQ */}
        <div>
          <h2 className="text-4xl font-bold mb-10 leading-tight">
            Join the platform before
            <br />
            the busy season
          </h2>

          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group py-5 border-b border-gray-200 cursor-pointer"
              >
                <summary className="flex justify-between items-center font-semibold text-lg list-none">
                  <span>{faq.question}</span>
                  <span className="transition group-open:rotate-45 text-2xl font-light">
                    +
                  </span>
                </summary>
                <div className="mt-4 text-gray-500 text-sm leading-relaxed pr-8">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Signup card */}
        <div className="relative">
          <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 h-full shadow-xl">
            <div className="bg-white rounded-[2.4rem] p-8 md:p-12 h-full flex flex-col justify-center">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">
                  Create your account
                  <br />
                  and get started today
                </h3>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                />
                <input
                  type="text"
                  placeholder="Suburb / Postcode"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
                />

                <div className="pt-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                    How will you use HospoHirer?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="radio"
                        name="user_type"
                        className="w-4 h-4 accent-black"
                        defaultChecked
                      />
                      <span className="text-sm font-medium">
                        I am a worker looking for shifts
                      </span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="radio"
                        name="user_type"
                        className="w-4 h-4 accent-black"
                      />
                      <span className="text-sm font-medium">
                        I am an employer looking for staff
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-[#111111] text-white font-medium py-4 rounded-xl mt-6 hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                >
                  Sign up for free
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
