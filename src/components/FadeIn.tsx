"use client"

import React from "react"
import { useInView } from "@/hooks/use-in-view"

type AnimationType = "fadeIn" | "slideUp" | "slideInLeft" | "slideInRight" | "blurInUp"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  animation?: AnimationType
  delay?: number
  duration?: number
  as?: React.ElementType
}

const animationVariants = {
  blurInUp: {
    initial: "translate-y-4 blur-sm opacity-0",
    animate: "translate-y-0 blur-0 opacity-100",
  },
  fadeIn: {
    initial: "opacity-0",
    animate: "opacity-100",
  },
  slideUp: {
    initial: "translate-y-8 opacity-0",
    animate: "translate-y-0 opacity-100",
  },
  slideInLeft: {
    initial: "-translate-x-8 opacity-0",
    animate: "translate-x-0 opacity-100",
  },
  slideInRight: {
    initial: "translate-x-8 opacity-0",
    animate: "translate-x-0 opacity-100",
  },
}

export function FadeIn({
  children,
  className = "",
  animation = "fadeIn",
  delay = 0,
  duration = 0.7,
  as: Component = "div",
}: FadeInProps) {
  const [ref, isInView] = useInView({ triggerOnce: true, rootMargin: "-50px" })
  const variant = animationVariants[animation]

  // React.createElement instead of JSX: with `Component` typed as the broad
  // React.ElementType, JSX's per-tag attribute resolution collapses props to
  // `never` under newer @types/react — createElement sidesteps that.
  return React.createElement(
    Component,
    {
      ref,
      className: `transition-all ease-out ${className} ${
        isInView ? variant.animate : variant.initial
      }`,
      style: {
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      },
    },
    children
  )
}
