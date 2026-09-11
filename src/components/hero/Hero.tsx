"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative h-[300vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D emblem + GPU particle field, unified in one scene */}
        <div className="absolute inset-0 z-0">
          <HeroScene triggerRef={sectionRef} />
        </div>
      </div>
    </section>
  );
}
