'use client';

import { useState } from 'react';
import type { Package } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { FeaturedPackages } from '@/components/sections/featured-packages';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { ComparisonDialog } from '@/components/comparison-dialog';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';
import { featuredPackages as initialPackages } from '@/lib/data';

export function HomeView() {
  const [comparedPackages, setComparedPackages] = useState<Package[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedPackages 
          packages={initialPackages} 
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
