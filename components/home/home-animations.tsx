"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/* --------------------------------
   Hero animation
-------------------------------- */

export function HeroAnimation({
  children,
  delay = 0,
  className,
}: AnimationProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------
   Scroll fade animation
-------------------------------- */

export function FadeIn({
  children,
  delay = 0,
  className,
}: AnimationProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------
   Floating card
-------------------------------- */

export function FloatingCard({
  children,
  className,
}: AnimationProps) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------
   Hover plus button
-------------------------------- */

export function AnimatedPlus() {
  return (
    <motion.div
      whileHover={{
        rotate: 90,
        scale: 1.1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
      className="
        flex h-9 w-9
        cursor-pointer
        items-center justify-center
        rounded-full
        bg-zinc-100
      "
    >
      +
    </motion.div>
  );
}

/* --------------------------------
   AI pulse
-------------------------------- */

export function PulseDot() {
  return (
    <motion.span
      className="h-2 w-2 rounded-full bg-emerald-500"
      animate={{
        scale: [1, 1.35, 1],
        opacity: [1, 0.6, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* --------------------------------
   Hover card
-------------------------------- */

export function HoverCard({
  children,
  className,
}: AnimationProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}