'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Package } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { PackageList } from '@/components/package-list-detailed';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useComparison } from '@/hooks/use-comparison';
import { useAuth } from '@/hooks/use-auth';
import { trackPackageClick } from '@/lib/analytics';

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const router = useRouter();
  const { addPackage, removePackage, packages: comparedPackages, isCompareMode } = useComparison();
  const { user } = useAuth();

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

  const handleCompareToggle = (pkg: Package, isSelected: boolean) => {
    if (isSelected) {
      addPackage(pkg);
    } else {
      removePackage(pkg.id);
    }
  };
  
  const handleMoreInfo = async (pkg: Package) => {
    if (user) {
      await trackPackageClick(pkg, user);
    }
  }

  const isPackageSelected = (pkgId: string) => {
    return comparedPackages.some((p) => p.id === pkgId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <PackageList 
          packages={packages} 
          title="Featured Umrah Packages" 
          onCompareToggle={handleCompareToggle} 
          isPackageSelected={isPackageSelected}
          isCompareMode={isCompareMode}
          onMoreInfo={handleMoreInfo}
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
