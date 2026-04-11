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
                <p className="text-sm text-gray-500">Free for workers. Simple for employers.</p>
              </div>

              <div className="space-y-3">
                <a
                  href="/auth/signup?role=worker"
                  className="flex items-center gap-4 w-full p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-orange-300 hover:bg-orange-50 transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-orange-200">
                    <i className="fa-solid fa-mug-hot text-gray-400 group-hover:text-orange-500 transition"></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">I&apos;m a Worker</p>
                    <p className="text-xs text-gray-400">Barista, chef, wait staff…</p>
                  </div>
                  <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-orange-400 transition"></i>
                </a>

                <a
                  href="/auth/signup?role=employer"
                  className="flex items-center gap-4 w-full p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-orange-300 hover:bg-orange-50 transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-orange-200">
                    <i className="fa-solid fa-store text-gray-400 group-hover:text-orange-500 transition"></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">I&apos;m an Employer</p>
                    <p className="text-xs text-gray-400">Cafe, restaurant, venue…</p>
                  </div>
                  <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-orange-400 transition"></i>
                </a>

                <div className="text-center pt-2">
                  <span className="text-xs text-gray-400">Already have an account? </span>
                  <a href="/auth/login" className="text-xs font-semibold text-[#111111] hover:text-orange-600 transition">
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
