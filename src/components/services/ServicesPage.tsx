'use client';

import React from 'react';
import PageShell from '@/components/site/PageShell';
import SplitWords from '@/components/site/SplitWords';
import { Container, Label, PrimaryButton, body, display } from '@/components/site/ui';
import { FadeIn } from '@/components/FadeIn';

// Placeholder: the Services page content has not been supplied by Digital Den yet.
// Replace this with the approved Services copy and sections when it arrives.
export default function ServicesPage() {
  return (
    <PageShell>
      {(openAction) => (
        <Container className="pt-44 lg:pt-56 pb-32 lg:pb-48">
          <FadeIn animation="fadeIn">
            <Label>Services</Label>
          </FadeIn>
          <h1 className={`mt-10 max-w-5xl text-[3.5rem] sm:text-7xl lg:text-[8rem] ${display}`}>
            <SplitWords>
              Our <span className="gradient-text">services</span>
            </SplitWords>
          </h1>
          <FadeIn animation="slideUp" delay={0.25} className="mt-12">
            <p className={`${body} max-w-xl`}>Details coming soon.</p>
            <div className="mt-8">
              <PrimaryButton onClick={openAction}>Apply as Startup</PrimaryButton>
            </div>
          </FadeIn>
        </Container>
      )}
    </PageShell>
  );
}
