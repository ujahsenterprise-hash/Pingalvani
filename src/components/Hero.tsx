"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./motion";

export default function Hero() {
  return (
    <section
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-gradient-to-br
        from-orange-200
        via-orange-100
        to-white
      "
    >
      {/* Background glows */}
      <div
        className="
          pointer-events-none
          absolute
          left-[-120px]
          top-20
          h-[360px]
          w-[360px]
          rounded-full
          bg-orange-300/30
          blur-3xl
          sm:h-[450px]
          sm:w-[450px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          right-[-140px]
          h-[420px]
          w-[420px]
          rounded-full
          bg-rose-300/25
          blur-3xl
          sm:h-[520px]
          sm:w-[520px]
        "
      />

      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          items-center
          px-5
          pb-12
          pt-8
          sm:px-8
          sm:pt-10
          lg:min-h-screen
          lg:flex-row
          lg:items-center
          lg:px-12
          lg:py-16
        "
      >
        {/* =====================================================
            PORTRAIT
        ===================================================== */}
        <div
          className="
            order-1
            flex
            w-full
            shrink-0
            justify-center
            pt-16
            sm:pt-16
            lg:order-2
            lg:w-1/2
            lg:pt-0
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
              relative
              z-10
              w-[62vw]
              max-w-[280px]
              sm:w-[54vw]
              sm:max-w-[330px]
              lg:w-full
              lg:max-w-[430px]
            "
          >
            <motion.div
              animate={{
                y: [0, -7, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Soft outer glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-[-5px]
                  rounded-[50%]
                  bg-white/60
                  blur-md
                "
              />

              {/* =================================================
                  VERTICAL OVAL PORTRAIT
              ================================================= */}
              <div
                className="
                  relative
                  mx-auto
                  h-[76vw]
                  max-h-[370px]
                  w-full
                  max-w-[280px]
                  overflow-hidden
                  rounded-[50%]
                  bg-white
                  p-2
                  shadow-2xl
                  ring-4
                  ring-white/70
                  sm:h-[400px]
                  sm:max-h-none
                  sm:max-w-[330px]
                  sm:p-2.5
                  lg:h-[520px]
                  lg:max-w-[430px]
                "
              >
                {/* Image */}
                <div
                  className="
                    relative
                    h-full
                    w-full
                    overflow-hidden
                    rounded-[50%]
                    bg-gray-200
                  "
                >
                  <Image
                    src="/poet.jpg"
                    alt="Shree Pingalshinh Patabhai Narela"
                    fill
                    priority
                    quality={100}
                    sizes="
                      (max-width: 640px) 62vw,
                      (max-width: 1024px) 54vw,
                      430px
                    "
                    className="
                      h-full
                      w-full
                      rounded-[50%]
                      object-contain
                      brightness-[1.08]
                      contrast-[1.03]
                    "
                  />

                  {/* Very subtle brightness layer */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      rounded-[50%]
                      bg-white/5
                    "
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div
          className="
            order-2
            z-10
            mt-8
            w-full
            text-center
            sm:mt-10
            lg:order-1
            lg:mt-0
            lg:w-1/2
            lg:pr-12
            lg:text-left
          "
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {/* Quote */}
            <motion.p
              variants={fadeUp}
              className="
                text-sm
                font-semibold
                text-rose-700
                sm:text-base
              "
            >
              “शब्द मेरी पहचान, कविता मेरी जान”
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="
                mt-3
                font-serif
                text-4xl
                font-bold
                leading-tight
                text-rose-800
                sm:text-5xl
                lg:text-6xl
              "
            >
              Shree Pingalshinh
              <span className="block">
                Patabhai Narela
              </span>
            </motion.h1>

            {/* Profession */}
            <motion.h2
              variants={fadeUp}
              className="
                mx-auto
                mt-4
                max-w-[360px]
                text-xl
                font-semibold
                leading-relaxed
                text-rose-800
                sm:max-w-xl
                sm:text-2xl
                lg:mx-0
              "
            >
              Rajkavi
            </motion.h2>

            {/* Location */}
            <motion.h3
              variants={fadeUp}
              className="
                mt-4
                text-2xl
                font-bold
                text-gray-900
                sm:text-3xl
              "
            >
              Bhavnagar State
            </motion.h3>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="
                mx-auto
                mt-5
                max-w-xl
                text-base
                leading-8
                text-gray-600
                sm:text-lg
                lg:mx-0
              "
            >
              कविताएँ जो दिल को छू जाएं, विचार जो जीवन बदल दें, और शब्द जो
              हमेशा याद रहें।
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              className="
                mt-7
                flex
                flex-col
                justify-center
                gap-4
                sm:flex-row
                lg:justify-start
              "
            >
              <Link
                href="/poems"
                className="
                  inline-flex
                  min-h-14
                  items-center
                  justify-center
                  rounded-full
                  bg-rose-800
                  px-8
                  py-3
                  text-base
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:scale-[1.03]
                  hover:bg-rose-900
                "
              >
                Read Poems
              </Link>

              <button
                type="button"
                className="
                  inline-flex
                  min-h-14
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-rose-800
                  px-8
                  py-3
                  text-base
                  font-semibold
                  text-rose-800
                  transition
                  hover:scale-[1.03]
                  hover:bg-white/50
                "
              >
                Listen 🎧
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="
                mx-auto
                mt-9
                grid
                max-w-md
                grid-cols-3
                divide-x
                divide-gray-400/40
                lg:mx-0
                lg:max-w-lg
              "
            >
              {[
                {
                  num: "500+",
                  label: "Poems",
                },
                {
                  num: "25+",
                  label: "Awards",
                },
                {
                  num: "100+",
                  label: "Events",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="px-3 text-center"
                >
                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-gray-900
                      sm:text-3xl
                    "
                  >
                    {item.num}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-500
                      sm:text-sm
                    "
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}