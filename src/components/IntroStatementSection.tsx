'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { TextAnimate } from './TextAnimate';
import { FadeIn } from './FadeIn';

// Intro copy (final, approved by Digital Den): keep wording exactly as supplied.
// Card styling follows a "packages" layout: dark rounded card, title + body, inset photo with
// a white pill link. Pill labels are existing page names (no new copy).
const supportingElements = [
  {
    title: 'Programs & Venture Building',
    body: 'Structured support designed around different stages of startup growth.',
    image: '/images/programs/readiness.jpg',
    link: { label: 'Programs', href: '/programs' },
  },
  {
    title: 'Partners, Mentors & Capital',
    body: 'Access to the people and resources that can move ventures forward.',
    image: '/images/platform/expertise.jpg',
    link: { label: 'Partners', href: '/partners' },
  },
  {
    title: 'International Market Access',
    body: 'Connections and opportunities extending beyond local markets.',
    image: '/images/partners/us.jpg',
    link: { label: 'Opportunities', href: '/opportunities' },
  },
];

interface IntroStatementSectionProps {
  /** Element the "Enter Digital Den" CTA scrolls to (the Home Page). */
  targetId?: string;
}

export default function IntroStatementSection({ targetId = 'main-content' }: IntroStatementSectionProps) {
  const handleEnter = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative z-30 w-full min-h-screen bg-den flex items-center justify-center px-4 sm:px-8 lg:px-12 py-28 sm:py-36">
      <div className="w-full max-w-[1450px] mx-auto flex flex-col items-center text-center">
        {/* Main positioning statement */}
        <TextAnimate
          as="h2"
          animation="blurInUp"
          by="word"
          delay={0.1}
          className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-2xl sm:text-4xl lg:text-[44px] leading-[125%] tracking-tight text-white max-w-4xl mx-auto"
        >
          A startup launch platform and venture studio connecting founders with the right support, strategic partners, capital and international markets.
        </TextAnimate>

        {/* Three supporting elements */}
        <div className="mt-14 sm:mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 text-left">
          {supportingElements.map((item, i) => (
            <FadeIn key={item.title} animation="slideUp" delay={0.2 + i * 0.15} duration={1} className="h-full">
              <article className="group flex h-full flex-col rounded-[28px] border border-white/[0.06] bg-[#161618] p-5 sm:p-6 transition-colors duration-500 hover:border-white/15">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-medium text-2xl sm:text-[28px] leading-[1.15] tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-sm sm:text-[15px] leading-[1.6] text-white/70">
                  {item.body}
                </p>

                <div className="relative mt-6 aspect-[4/3.6] w-full overflow-hidden rounded-[20px]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 92vw, 30vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <Link
                    href={item.link.href}
                    className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-white py-2 pl-5 pr-2 text-sm font-medium text-black shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <span>{item.link.label}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn animation="fadeIn" delay={0.6} duration={1} className="mt-14 sm:mt-20">
          <button
            onClick={handleEnter}
            className="group h-[54px] px-7 rounded-[14px] bg-gradient-to-b from-white/[0.08] to-white/[0.15] bg-white/10 border border-white/20 shadow-[inset_0_12px_40px_-10px_rgba(255,255,255,0.25),0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-[15px] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] hover:bg-white/25 hover:border-white/50 hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer inline-flex items-center gap-3"
          >
            Enter Digital Den
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
