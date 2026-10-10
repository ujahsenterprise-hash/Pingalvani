"use client";

import { useState } from "react";

export default function AudioPlayer({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const audio = typeof Audio !== "undefined" ? new Audio(src) : null;

  const togglePlay = () => {
    if (!audio) return;

    if (!playing) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    setPlaying(!playing);
  };

  return (
    <button
      onClick={togglePlay}
      className="px-4 py-2 bg-black text-white rounded-full mt-3"
    >
      {playing ? "Stop Recitation" : "Play Poetry 🎧"}
    </button>
  );
}