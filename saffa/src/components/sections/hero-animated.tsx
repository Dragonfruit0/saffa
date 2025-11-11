'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadLinksPreset } from "@tsparticles/preset-links";
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Minus, Plus } from 'lucide-react';
import { format } from 'date-fns';

export function HeroAnimated() {
  const [showBismillah, setShowBismillah] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [init, setInit] = useState(false);
  const [members, setMembers] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadLinksPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBismillah(false);
      setShowContent(true);
    }, 3000); // Show Bismillah for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const particlesLoaded = async (container: Container | undefined) => {
    console.log(container);
  };

  const handleBeginSearch = () => {
    const queryParams = new URLSearchParams();
    if (date) {
      queryParams.set('date', format(date, 'yyyy-MM-dd'));
    }
    queryParams.set('members', members.toString());
    router.push(`/packages?${queryParams.toString()}`);
  };

  const options = useMemo(
    () => ({
      preset: "links",
      background: {
        color: { value: "transparent" },
      },
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: { value: "#ffffff" },
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 50,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 0.5,
            },
          },
          push: {
            quantity: 2,
          },
        },
      },
    }),
    [],
  );

  if (init) {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2024/01/26/198164-906869460_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full items-center justify-center">
          {showBismillah && (
            <div className="text-white text-6xl font-arabic fade-in-out">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </div>
          )}
          {showContent && (
            <div className="flex max-w-3xl flex-col items-center text-center text-white animate-fade-in">
              <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl font-display">
                Your path to peace
              </h1>
              <p className="mt-6 text-lg md:text-xl">
                SafaMarwah brings a perfect package for you.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center justify-between w-[280px] gap-2 bg-white px-2 h-10 rounded-md">
                  <Button variant="outline" size="icon" onClick={() => setMembers(Math.max(1, members - 1))}>
                    <Minus className="h-4 w-4 text-black" />
                  </Button>
                  <span className="text-black">Number of People: {members}</span>
                  <Button variant="outline" size="icon" onClick={() => setMembers(members + 1)}>
                    <Plus className="h-4 w-4 text-black" />
                  </Button>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal text-black">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg shadow-lg transition-transform hover:scale-105"
                  onClick={handleBeginSearch}
                >
                  Begin Your Search
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  } else {
    return <></>
  }
}
