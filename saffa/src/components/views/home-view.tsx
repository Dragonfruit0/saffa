'use client';

import type { Package } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { FeaturedPackages } from '@/components/sections/featured-packages';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { useComparison } from '@/hooks/use-comparison';
import { featuredPackages as initialPackages } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { trackPackageClick } from '@/lib/analytics';

export function HomeView() {
  const { addPackage, removePackage, packages: comparedPackages, isCompareMode } = useComparison();
  const { user } = useAuth();

  const handleCompareToggle = (pkg: Package, isSelected: boolean) => {
    if (isSelected) {
      addPackage(pkg);
    } else {
      removePackage(pkg.id);
    }
  };

  const isPackageSelected = (pkgId: string) => {
    return comparedPackages.some((p) => p.id === pkgId);
  };

  const handleMoreInfo = async (pkg: Package) => {
    if (user) {
        await trackPackageClick(pkg, user);
    }
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
          isCompareMode={isCompareMode}
          onMoreInfo={handleMoreInfo}
        />
        <About />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
