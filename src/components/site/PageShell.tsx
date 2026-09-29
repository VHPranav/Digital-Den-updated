'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ActionModal from '@/components/ActionModal';

// Shared chrome for the inner pages: navbar, footer and the lead-capture modal.
// Children receive `openAction` so any CTA on the page can open the modal.
export default function PageShell({ children }: { children: (openAction: () => void) => React.ReactNode }) {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const openAction = () => setIsActionModalOpen(true);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-600 selection:text-white relative overflow-x-clip">
      <Navbar onOpenAction={openAction} />
      {children(openAction)}
      <div className="relative z-20 bg-black">
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
