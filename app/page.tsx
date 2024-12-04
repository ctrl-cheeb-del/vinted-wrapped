"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-pink-500 flex flex-col items-center justify-center relative">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center text-white space-y-6">
          <h1 className="text-6xl font-bold tracking-tight">
            Your 2024 Vinted Wrapped
          </h1>
          <p className="text-xl opacity-90">
            Discover your selling journey through the year
          </p>
          <Link 
            href="/wrapped"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all"
          >
            Start Your Journey <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 text-white/60 text-sm flex items-center gap-2">
        Sponsored by
        <Link href="https://resoled.it" target="_blank" className="hover:opacity-80 transition-opacity inline-flex items-center gap-2">
          <Image
            src="/resoled.png"
            alt="Resoled"
            width={16}
            height={16}
            className="inline-block object-contain"
          />
          <span>Resoled</span>
        </Link>
        and
        <Link href="https://vinta.app" target="_blank" className="hover:opacity-80 transition-opacity inline-flex items-center gap-2">
          <Image
            src="/vinta.png"
            alt="Vinta"
            width={16}
            height={16}
            className="inline-block object-contain"
          />
          <span>Vinta</span>
        </Link>
      </div>
    </div>
  );
}