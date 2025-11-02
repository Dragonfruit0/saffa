'use client';

import type { Package } from "@/lib/types";
import { PackageCard } from "@/components/package-card";

interface FeaturedPackagesProps {
  packages: Package[];
  onCompareToggle: (pkg: Package, isSelected: boolean) => void;
  isPackageSelected: (pkgId: string) => boolean;
}

export function FeaturedPackages({ packages, onCompareToggle, isPackageSelected }: FeaturedPackagesProps) {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">Featured Packages</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Explore our handpicked selection of top-rated packages for your spiritual journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackageCard 
              key={pkg.id} 
              package={pkg}
              onCompareToggle={onCompareToggle}
              isSelected={isPackageSelected(pkg.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
