"use client";

import Image from "next/image";

const reels = [
  "/poet.jpg",
  "/poet.jpg",
  "/poet.jpg",
];

export default function PoetryReels() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {reels.map((r, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden hover:scale-105 transition"
        >
          <Image src={r} alt="reel" width={400} height={500} />
        </div>
      ))}
    </div>
  );
}