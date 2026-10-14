'use client';

import React from 'react';

// Quiet break between Home sections: a hairline that fades out at both ends.
// Gives clear separation without boxing sections in.
export default function SectionDivider() {
  return (
    <div aria-hidden="true" className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
