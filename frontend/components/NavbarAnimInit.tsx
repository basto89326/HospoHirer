"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function NavbarAnimInit() {
  useEffect(() => {
    gsap.from(".nav-anim", {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  return null;
}
