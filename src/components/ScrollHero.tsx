"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollHero() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.to(ref.current, {
      scale: 1.2,
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
      },
    });
  });

  return (
    <div ref={ref} className="h-screen flex items-center justify-center">
      <h1 className="text-6xl font-bold">State Level Poet</h1>
    </div>
  );
}