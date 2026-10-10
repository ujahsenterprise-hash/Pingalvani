"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function ParallaxHero() {
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }}>
        <Image
          src="/poet.jpg"
          alt="poet"
          width={500}
          height={500}
          className="rounded-full shadow-2xl"
        />
      </motion.div>
    </div>
  );
}