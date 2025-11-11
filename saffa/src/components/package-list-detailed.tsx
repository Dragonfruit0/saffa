
import type { Package } from '@/lib/types';
import { PackageCard } from '@/components/package-card-detailed';

type PackageListProps = {
  packages: Package[];
  title?: string;
  onCompareToggle?: (pkg: Package, isSelected: boolean) => void;
  isPackageSelected?: (pkgId: string) => boolean;
  isCompareMode?: boolean;
  onRemove?: (pkgId: string) => void; // Added for wishlist removal
  onBookNow?: (pkg: Package) => void;
  onMoreInfo?: (pkg: Package) => void;
};

export function PackageList({ packages, title, onCompareToggle, isPackageSelected, isCompareMode, onRemove, onBookNow, onMoreInfo }: PackageListProps) {
  const listContent = (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packages.map(pkg => (
        <PackageCard 
          key={pkg.id} 
          package={pkg} 
          onCompareToggle={onCompareToggle}
          isSelected={isPackageSelected ? isPackageSelected(pkg.id) : false}
          isCompareMode={isCompareMode}
          onRemove={onRemove} // Pass down the onRemove function
          onBookNow={onBookNow}
          onMoreInfo={onMoreInfo}
        />
      ))}
    </div>
  );

  if (title) {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">{title}</h2>
          {packages.length === 0 ? (
              <p className="text-center text-muted-foreground">No packages available at the moment. Please check back later.</p>
          ) : listContent}
        </div>
      </section>
    );
  }

  return listContent; // Render without the section wrapper if no title is provided
}
