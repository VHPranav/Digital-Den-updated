import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import SplitWords from './SplitWords';

// Editorial primitives for the inner pages: generous whitespace, hairline
// dividers, restrained type. Prefer these over boxed cards.

export function Container({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function Section({
  id,
  className = '',
  bordered = true,
  children,
}: {
  id?: string;
  className?: string;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-28 lg:py-44 ${bordered ? 'border-t border-white/[0.08]' : ''} ${className}`}>
      {children}
    </section>
  );
}

export function Label({ index, children, className = '' }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/40 ${className}`}>
      {index && (
        <>
          <span className="tabular-nums text-white/70">{index}</span>
          <span className="h-px w-10 bg-white/20" />
        </>
      )}
      <span>{children}</span>
    </div>
  );
}

export const display = 'font-semibold tracking-[-0.045em] leading-[0.95]';
export const heading = 'text-4xl sm:text-5xl lg:text-[4rem] font-semibold tracking-[-0.035em] leading-[1.04]';
export const lead = 'text-lg leading-[1.75] text-white/55';
export const body = 'text-[15px] leading-[1.75] text-white/50';

// Two-column section intro: label + title on the left, supporting copy bottom-right.
export function SectionHeader({
  index,
  label,
  title,
  intro,
  className = '',
}: {
  index?: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-end ${className}`}>
      <div className="lg:col-span-7">
        <Label index={index}>{label}</Label>
        <h2 className={`mt-8 ${heading}`}>
          <SplitWords>{title}</SplitWords>
        </h2>
      </div>
      {intro && <p className={`lg:col-span-4 lg:col-start-9 ${lead}`}>{intro}</p>}
    </div>
  );
}

type ActionProps = { children: React.ReactNode; href?: string; onClick?: () => void; className?: string };

export function PrimaryButton({ children, href, onClick, className = '' }: ActionProps) {
  const cls = `group inline-flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 text-sm font-medium text-black transition-colors hover:bg-purple-100 ${className}`;
  const inner = (
    <>
      {children}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function TextLink({ children, href, onClick, className = '' }: ActionProps) {
  const cls = `group inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white ${className}`;
  const inner = (
    <>
      <span className="border-b border-white/25 pb-1 transition-colors group-hover:border-white">{children}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

// Frameless image with a slow zoom on hover (hover is driven by a parent `group`).
export function Figure({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  dim = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  dim?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04] ${dim ? 'grayscale-[70%] opacity-70' : ''}`}
      />
    </div>
  );
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-8 overflow-x-auto">
      {items.map(({ key, label, count }) => {
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`shrink-0 text-sm transition-colors ${active ? 'text-white' : 'text-white/35 hover:text-white/70'}`}
          >
            {label}
            {count !== undefined && <sup className="ml-1 text-[10px] tabular-nums text-white/40">{count}</sup>}
            <span className={`mt-2 block h-px bg-white transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
          </button>
        );
      })}
    </div>
  );
}
