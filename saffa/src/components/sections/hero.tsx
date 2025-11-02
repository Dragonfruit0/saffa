'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-banner');

  return (
    <section className="relative w-full">
      <div className="absolute inset-0">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Hero background image of a holy site in Mecca"
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
         <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 container flex min-h-[60vh] lg:min-h-[70vh] items-center justify-center">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl font-headline">
            Your journey to Umrah begins with one conversation.
          </h1>
          <p className="mt-6 text-lg text-white/80 md:text-xl">
            Let our AI guide you to the perfect package, tailored just for you.
          </p>
          <div className="mt-8">
            <Link href="/chat">
              <Button
                size="lg"
                className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg shadow-lg transition-transform hover:scale-105"
              >
                Find My Package
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
