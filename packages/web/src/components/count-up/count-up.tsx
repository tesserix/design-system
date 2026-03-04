"use client"

import * as React from "react"
import {
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion,
} from "framer-motion"

export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

const CountUp = React.forwardRef<HTMLSpanElement, CountUpProps>(
  (
    {
      end,
      duration = 2,
      prefix = "",
      suffix = "",
      decimals = 0,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLSpanElement>(null)
    const ref = (forwardedRef as React.RefObject<HTMLSpanElement>) || internalRef
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, {
      damping: 30,
      stiffness: 80,
      duration: duration * 1000,
    })
    const isInView = useInView(ref, { once: true, margin: "-40px" })
    const prefersReducedMotion = useReducedMotion()

    React.useEffect(() => {
      if (isInView) {
        if (prefersReducedMotion) {
          const el = "current" in ref ? ref.current : null
          if (el) {
            el.textContent = `${prefix}${end.toFixed(decimals)}${suffix}`
          }
          return
        }
        motionValue.set(end)
      }
    }, [isInView, end, motionValue, prefersReducedMotion, prefix, decimals, suffix, ref])

    React.useEffect(() => {
      if (prefersReducedMotion) return

      const unsubscribe = springValue.on("change", (latest) => {
        const el = "current" in ref ? ref.current : null
        if (el) {
          el.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`
        }
      })

      return unsubscribe
    }, [springValue, prefix, suffix, decimals, prefersReducedMotion, ref])

    return (
      <span ref={ref} className={className} {...props}>
        {prefix}0{suffix}
      </span>
    )
  }
)
CountUp.displayName = "CountUp"

export { CountUp }
