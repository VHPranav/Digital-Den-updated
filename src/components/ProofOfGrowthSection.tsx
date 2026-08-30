'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TextAnimate } from './TextAnimate';
import { FadeIn } from './FadeIn';

const Map = dynamic(() => import('@/components/ui/map').then((mod) => mod.Map), { ssr: false });
const MapMarker = dynamic(() => import('@/components/ui/map').then((mod) => mod.MapMarker), { ssr: false });
const MapRoute = dynamic(() => import('@/components/ui/map').then((mod) => mod.MapRoute), { ssr: false });
import { MarkerContent, MarkerTooltip } from '@/components/ui/map';

export default function ProofOfGrowthSection() {
  return (
    <section className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-left">
          <div className="space-y-3">
            <FadeIn animation="fadeIn" delay={0.1}>
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-full inline-block">
                Proof of Growth & Beyond Borders
              </span>
            </FadeIn>
            <FadeIn animation="fadeIn" delay={0.2}>
              <h2
                className="font-['Inter',sans-serif] text-3xl sm:text-4xl lg:text-[44px] leading-[118%] font-medium tracking-tight"
                style={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #F3E8FF 45%, #D8B4FE 60%, #C084FC 75%, #A855F7 88%, #7E22CE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Connecting Founders Across Key Global Hubs
              </h2>
            </FadeIn>
          </div>

          <FadeIn animation="fadeIn" delay={0.3}>
            <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
              Startups that turned potential into investment, revenue, clients and international market presence across Montenegro, the Western Balkans, US, Jordan and Benelux.
            </p>
          </FadeIn>

          <div className="pt-2">
            <Link
              href="/portfolio"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2 w-fit"
            >
              <span>Explore Full Portfolio</span>
              <ExternalLink className="w-4 h-4 text-purple-300" />
            </Link>
          </div>
        </div>

        <FadeIn animation="slideUp" delay={0.4} className="relative w-full h-[420px] overflow-hidden" as="div">
          <div
            className="w-full h-full rounded-[27.9936px]"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%), rgba(0, 0, 0, 0.6)',
              border: '1.1664px solid rgba(255, 255, 255, 0.2)',
              boxShadow: 'inset 0px 13.9968px 46.656px -11.664px rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4.32px)',
              WebkitBackdropFilter: 'blur(4.32px)',
            }}
          >
          <Map center={[-73.98, 40.75]} zoom={12}>
            <MapRoute
              coordinates={[
                [-74.006, 40.7128],
                [-73.9857, 40.7484],
                [-73.9772, 40.7527],
                [-73.9654, 40.7829],
              ]}
              color="#3b82f6"
              width={4}
              opacity={0.8}
            />

            <MapMarker longitude={-74.006} latitude={40.7128}>
              <MarkerContent>
                <div className="flex w-6 h-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/50">
                  1
                </div>
              </MarkerContent>
              <MarkerTooltip>City Hall</MarkerTooltip>
            </MapMarker>

            <MapMarker longitude={-73.9857} latitude={40.7484}>
              <MarkerContent>
                <div className="flex w-6 h-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/50">
                  2
                </div>
              </MarkerContent>
              <MarkerTooltip>Empire State Building</MarkerTooltip>
            </MapMarker>

            <MapMarker longitude={-73.9772} latitude={40.7527}>
              <MarkerContent>
                <div className="flex w-6 h-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/50">
                  3
                </div>
              </MarkerContent>
              <MarkerTooltip>Grand Central Terminal</MarkerTooltip>
            </MapMarker>

            <MapMarker longitude={-73.9654} latitude={40.7829}>
              <MarkerContent>
                <div className="flex w-6 h-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/50">
                  4
                </div>
              </MarkerContent>
              <MarkerTooltip>Central Park</MarkerTooltip>
            </MapMarker>
            </Map>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
