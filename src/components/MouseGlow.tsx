"use client";

import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="fixed pointer-events-none w-[400px] h-[400px] rounded-full blur-3xl opacity-30 bg-rose-400"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
      }}
    />
  );
}