'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Package } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

const MoreInfoPage = () => {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('id');
  const [pkg, setPackage] = useState<Package | null>(null);

  useEffect(() => {
    if (packageId) {
      const fetchPackage = async () => {
        const docRef = doc(db, 'packages', packageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPackage({ id: docSnap.id, ...docSnap.data() } as Package);
        } else {
          console.log('No such document!');
        }
      };
      fetchPackage();
    }
  }, [packageId]);

  const handleBookNow = () => {
    if (pkg) {
      const message = `Assalamu'alaikum, I would like to book the ${pkg.name} package.`;
      window.open(`https://wa.me/919990237953?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (!pkg) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display">
        <div className="flex justify-end items-center mb-8 container mx-auto py-4">
            <Link href="/home" passHref>
                <Button variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                </Button>
            </Link>
        </div>
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-5xl flex-1 px-4">
              <div className="@container">
                <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
                  <div 
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full shadow-lg" 
                    style={{backgroundImage: `url(${pkg.imageUrls?.[0] || ''})`}}
                    role="img"
                    aria-label={pkg.name}
                  ></div>
                  <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                    <div className="flex flex-col gap-2 text-left">
                      <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        {pkg.name}
                      </h1>
                      <h2 className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                        {pkg.description}
                      </h2>
                    </div>
                    <div className="flex-wrap gap-3 flex">
                      <button onClick={handleBookNow} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                        <span className="truncate">Book Now</span>
                      </button>
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                        <span className="truncate">Download Brochure</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Package Overview</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 p-4">
                <div className="flex flex-1 gap-3 rounded-lg border border-gray-200 dark:border-[#404f4b] bg-white dark:bg-[#1e2523] p-4 flex-col">
                  <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight">{pkg.duration}</h2>
                    <p className="text-gray-500 dark:text-[#a2b4af] text-sm font-normal leading-normal">{pkg.nightsInMakkah} nights in Makkah, {pkg.nightsInMadinah} in Madinah</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-gray-200 dark:border-[#404f4b] bg-white dark:bg-[#1e2523] p-4 flex-col">
                  <span className="material-symbols-outlined text-primary text-3xl">hotel</span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight">{pkg.hotel}</h2>
                    <p className="text-gray-500 dark:text-[#a2b4af] text-sm font-normal leading-normal">Views of the Holy Mosques</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-gray-200 dark:border-[#404f4b] bg-white dark:bg-[#1e2523] p-4 flex-col">
                  <span className="material-symbols-outlined text-primary text-3xl">flight</span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight">{pkg.airlines}</h2>
                    <p className="text-gray-500 dark:text-[#a2b4af] text-sm font-normal leading-normal">Round-trip from major airports</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-gray-200 dark:border-[#404f4b] bg-white dark:bg-[#1e2523] p-4 flex-col">
                  <span className="material-symbols-outlined text-primary text-3xl">mosque</span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight">Guided Ziyarat</h2>
                    <p className="text-gray-500 dark:text-[#a2b4af] text-sm font-normal leading-normal">Tours of significant holy sites</p>
                  </div>
                </div>
              </div>
              <div className="sticky top-[61px] z-40 bg-background-light dark:bg-background-dark pt-8">
                <div className="flex border-b border-gray-200 dark:border-[#404f4b] px-4 gap-8">
                  <a className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-[13px] pt-4" href="#">
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">Itinerary</p>
                  </a>
                  <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-[#a2b4af] hover:text-gray-800 dark:hover:text-white pb-[13px] pt-4" href="#">
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">Inclusions</p>
                  </a>
                  <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-[#a2b4af] hover:text-gray-800 dark:hover:text-white pb-[13px] pt-4" href="#">
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">Accommodation</p>
                  </a>
                  <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-[#a2b4af] hover:text-gray-800 dark:hover:text-white pb-[13px] pt-4" href="#">
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">Pricing</p>
                  </a>
                </div>
              </div>
              <div className="px-4 py-8">
                <div className="relative pl-8 border-l-2 border-gray-200 dark:border-white/20 space-y-8">
                    {pkg.itinerary?.map((item, index) => (
                        <div className="relative" key={index}>
                            <div className="absolute -left-[34px] top-0.5 h-4 w-4 rounded-full bg-primary border-4 border-background-light dark:border-background-dark"></div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.day}: {item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className="sticky bottom-0 z-50 mt-auto bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-gray-200 dark:border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Starting from</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{pkg.price.toLocaleString()} / person</span>
              </div>
              <button  onClick={handleBookNow} className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg hover:bg-primary/90 transition-colors">
                <span className="truncate">Book Your Spot Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoPage;