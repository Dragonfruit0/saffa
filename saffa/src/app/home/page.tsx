
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Package } from '@/lib/types';
import { SiteHeader } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { FeaturedPackages } from '@/components/sections/featured-packages';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { ComparisonDialog } from '@/components/comparison-dialog';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [comparedPackages, setComparedPackages] = useState<Package[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      setComparedPackages((prev) => [...prev, pkg]);
    } else {
      setComparedPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    }
  };

  const isPackageSelected = (pkgId: string) => {
    return comparedPackages.some((p) => p.id === pkgId);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeaturedPackages 
          packages={packages} 
          onCompareToggle={handleCompareToggle} 
          isPackageSelected={isPackageSelected}
        />
        <About />
        <Testimonials />
      </main>
      <Footer />
      {comparedPackages.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in-0 zoom-in-95">
          <Button 
            size="lg" 
            onClick={() => setIsDialogOpen(true)} 
            disabled={comparedPackages.length < 2}
            className="rounded-full shadow-2xl bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <GitCompare className="mr-2 h-5 w-5" />
            Compare ({comparedPackages.length})
            {comparedPackages.length < 2 && <span className="ml-2 text-xs opacity-80">(Select 2+)</span>}
          </Button>
        </div>
      )}
      <ComparisonDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        packages={comparedPackages} 
      />
    </div>
  );
}
