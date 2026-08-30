"use client"

import React, { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"

type AnimationType = "blurInUp" | "fadeIn" | "slideUp" | "slideInLeft" | "slideInRight"
type AnimateBy = "word" | "character" | "line" | "none"

interface TextAnimateProps {
  children: React.ReactNode
  className?: string
  animation?: AnimationType
  by?: AnimateBy
  delay?: number
  staggerDelay?: number
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
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

export function TextAnimate({
  children,
  className = "",
  animation = "blurInUp",
  by = "word",
  delay = 0,
  staggerDelay = 0.05,
  as: Component = "div",
}: TextAnimateProps) {
  const [ref, isInView] = useInView({ triggerOnce: true, rootMargin: "-100px" })

  const variant = animationVariants[animation]

  // Extract text content from children
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node)
    }
    if (Array.isArray(node)) {
      return node.map(getTextContent).join('')
    }
    if (React.isValidElement(node)) {
      return getTextContent((node.props as any).children)
    }
    return ''
  }

  // Split text based on 'by' prop
  const splitText = () => {
    const text = getTextContent(children)
    if (by === "word") {
      return text.split(" ")
    } else if (by === "character") {
      return text.split("")
    } else if (by === "line") {
      return text.split("\n")
    } else {
      return [text]
    }
  }

  const parts = splitText()

  return (
    <Component ref={ref} className={className}>
      {parts.map((part, index) => (
        <span key={index} className={by === "line" ? "block w-full text-center" : "inline-block"}>
          <span
            className={`inline-block transition-all duration-700 ease-out ${
              isInView ? variant.animate : variant.initial
            }`}
            style={{
              transitionDelay: `${delay + index * staggerDelay}s`,
            }}
          >
            {part}
          </span>
          {by === "word" && index < parts.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Component>
  )
}
