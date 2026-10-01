'use client';

import React, { useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ActionModal from '@/components/ActionModal';
import { useTextReveal } from './useTextReveal';

// Shared chrome for the inner pages: navbar, footer and the lead-capture modal.
// Children receive `openAction` so any CTA on the page can open the modal.
export default function PageShell({ children }: { children: (openAction: () => void) => React.ReactNode }) {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const openAction = () => setIsActionModalOpen(true);
  const mainRef = useRef<HTMLElement>(null);
  useTextReveal(mainRef);

  return (
    <main ref={mainRef} data-inner className="min-h-screen bg-[#0b0b0c] text-white selection:bg-purple-600 selection:text-white relative overflow-x-clip">
      <Navbar onOpenAction={openAction} />
      {children(openAction)}
      <div data-footer className="relative z-20 bg-[#0b0b0c]">
        <Footer />
      </div>
      <ActionModal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} />
    </main>
  );
}

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] text-purple-300/80 ${className}`}>{children}</p>
  );
}
