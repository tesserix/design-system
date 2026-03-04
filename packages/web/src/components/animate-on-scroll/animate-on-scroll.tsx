"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  type Variant,
} from "framer-motion"

type AnimationVariant =
  | "fade-up"
  | "fade-in"
  | "slide-left"
  | "slide-right"
  | "scale-in"

const animationVariants: Record<
  AnimationVariant,
  { hidden: Variant; visible: Variant }
> = {
  "fade-up": {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
}

export interface AnimateOnScrollProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  as?: "div" | "section"
}

function AnimateOnScroll({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.5,
  className,
  as = "div",
}: AnimateOnScrollProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const prefersReducedMotion = useReducedMotion()

  const Component = as === "section" ? motion.section : motion.div

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>
  }

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animationVariants[variant]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}

export interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  delay?: number
}

function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delay = 0,
}: StaggerContainerProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  variant?: AnimationVariant
}

function StaggerItem({
  children,
  className,
  variant = "fade-up",
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={animationVariants[variant]}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { AnimateOnScroll, StaggerContainer, StaggerItem }
export type { AnimationVariant }
