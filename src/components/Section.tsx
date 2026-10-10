"use client";

import { motion, useReducedMotion } from "framer-motion";

type SectionProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export default function Section({
  children,
  delay = 0,
  className = "",
}: SectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 60,
        scale: reduceMotion ? 1 : 0.98,
        filter: reduceMotion ? "none" : "blur(10px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Apple-like easing
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}