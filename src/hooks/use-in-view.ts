import { useEffect, useRef, useState } from "react"

interface UseInViewOptions {
  triggerOnce?: boolean
  rootMargin?: string
  threshold?: number | number[]
}

export function useInView(
  options: UseInViewOptions = {}
): [React.RefObject<any>, boolean] {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<Element>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
      if (entry.isIntersecting && options.triggerOnce && ref.current) {
        observer.unobserve(ref.current)
      }
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options.triggerOnce, options.rootMargin, options.threshold])

  return [ref, isInView]
}
