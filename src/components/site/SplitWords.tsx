'use client';

import React, { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { EASE } from './editorial';

// Heading intro matching the home page: each word blurs in and rises, staggered,
// when the heading scrolls into view. Nested spans (accents, italics) and <br />
// are kept; only their text is split, so it works with mixed heading markup.
export default function SplitWords({
  children,
  delay = 0,
  stagger = 0.06,
}: {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setOn(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let index = 0;
  const wordStyle = (): React.CSSProperties => {
    const d = delay + index++ * stagger;
    return {
      display: 'inline-block',
      opacity: on ? 1 : 0,
      filter: on ? 'none' : 'blur(10px)',
      transform: on ? 'none' : 'translateY(0.3em)',
      transition: `opacity 0.9s ${EASE} ${d}s, filter 0.9s ${EASE} ${d}s, transform 1s ${EASE} ${d}s`,
    };
  };

  const walk = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node)
        .split(/(\s+)/)
        .map((part, i) =>
          part === '' ? null : /^\s+$/.test(part) ? part : (
            <span key={i} style={wordStyle()}>
              {part}
            </span>
          ),
        );
    }
    if (isValidElement<{ children?: React.ReactNode }>(node)) {
      if (node.type === 'br' || node.props.children == null) return node;
      return cloneElement(node, undefined, Children.map(node.props.children, walk));
    }
    return node;
  };

  return <span ref={ref}>{Children.map(children, walk)}</span>;
}
