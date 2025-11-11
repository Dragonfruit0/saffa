'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Package } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroAnimated } from '@/components/sections/hero-animated';
import { PackageList } from '@/components/package-list-detailed';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useComparison } from '@/hooks/use-comparison';
import { useAuth } from '@/hooks/use-auth';
import { trackPackageClick, trackBookNowClick } from '@/lib/analytics';

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const router = useRouter();
  const { addPackage, removePackage, packages: comparedPackages, isCompareMode } = useComparison();
  const { user } = useAuth();
  const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const querySnapshot = await getDocs(collection(db, 'packages'));
      const packagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Package[];
      setPackages(packagesData);
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (user && postLoginAction) {
      postLoginAction();
      setPostLoginAction(null);
    }
  }, [user, postLoginAction]);

  const handleProtectedAction = (action: () => void, redirectUrl?: string) => {
    if (!user) {
      setPostLoginAction(() => action);
      router.push(`/signup?redirect=${redirectUrl || window.location.pathname}`);
    } else {
      action();
    }
  };

  const handleCompareToggle = (pkg: Package, isSelected: boolean) => {
    if (isSelected) {
      addPackage(pkg);
    } else {
      removePackage(pkg.id);
    }
  };
  
  const handleMoreInfo = (pkg: Package) => {
    if (user) {
      trackPackageClick(pkg, user);
    }
    router.push(`/more-info?id=${pkg.id}`);
  }
  
  const handleBookNow = (pkg: Package) => {
      handleProtectedAction(() => {
          trackBookNowClick(pkg, user!)
          const message = `I came from Safamarwah.in and I'm interested in the ${pkg.name} package.\n\nHere are the details:\n- Price: INR ${pkg.price.toLocaleString('en-IN')}\n- Duration: ${pkg.duration}\n- Distance from Haram: ${pkg.distanceFromHaram}\n- Distance from Masjid e Nabawi: ${pkg.distanceFromMasjidENabawi}`;
          const whatsappUrl = `https://api.whatsapp.com/send/?phone=919908829096&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
          window.open(whatsappUrl, '_blank');
      });
  }

  const isPackageSelected = (pkgId: string) => {
    return comparedPackages.some((p) => p.id === pkgId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroAnimated />
        <PackageList 
          packages={packages} 
          title="Featured Umrah Packages" 
          onCompareToggle={handleCompareToggle} 
          isPackageSelected={isPackageSelected}
          isCompareMode={isCompareMode}
          onMoreInfo={handleMoreInfo}
          onBookNow={handleBookNow}
        />
        <About />
        <Testimonials />
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 animate-in fade-in-0 zoom-in-95">
        <Button 
          size="lg" 
          onClick={() => router.push('/chat')} 
          className="rounded-full shadow-2xl"
        >
          <Bot className="mr-2 h-5 w-5" />
          AI Bot
        </Button>
      </div>
    </div>
  );
}
