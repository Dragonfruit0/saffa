'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Package, PackageCategory } from '@/lib/types';
import { PackageCard } from '@/components/package-card';
import { ComparisonDialog } from '@/components/comparison-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Home, Filter } from 'lucide-react';

export default function PackagesPage() {
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [filters, setFilters] = useState({
    duration: '',
    distanceFromHaram: '',
    distanceFromMasjidENabawi: '',
    food: '',
    airlines: '',
    category: '',
    priceRange: [0, 500000],
  });
  const [comparisonPackages, setComparisonPackages] = useState<Package[]>([]);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      const querySnapshot = await getDocs(collection(db, 'packages'));
      const packagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Package[];
      setAllPackages(packagesData);
      setFilteredPackages(packagesData);
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    let packages = allPackages;

    if (filters.duration) {
      packages = packages.filter(p => p.duration.toLowerCase().includes(filters.duration.toLowerCase()));
    }
    if (filters.distanceFromHaram) {
        packages = packages.filter(p => p.distanceFromHaram.toLowerCase().includes(filters.distanceFromHaram.toLowerCase()));
    }
    if (filters.distanceFromMasjidENabawi) {
        packages = packages.filter(p => p.distanceFromMasjidENabawi.toLowerCase().includes(filters.distanceFromMasjidENabawi.toLowerCase()));
    }
    if (filters.food) {
        packages = packages.filter(p => p.food?.toLowerCase().includes(filters.food.toLowerCase()));
    }
    if (filters.airlines) {
      packages = packages.filter(p => p.airlines?.toLowerCase().includes(filters.airlines.toLowerCase()));
    }
    if (filters.category) {
      packages = packages.filter(p => p.category === filters.category);
    }
    packages = packages.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    setFilteredPackages(packages);
  }, [filters, allPackages]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleCompare = (pkg: Package, isChecked: boolean) => {
    setComparisonPackages(prev => {
      if (isChecked) {
        return [...prev, pkg];
      } else {
        return prev.filter(p => p.id !== pkg.id);
      }
    });
  };

  const packageCategories: PackageCategory[] = ['Economy', 'Deluxe', 'Luxury', 'Family', 'Group', 'Private'];

  const renderFilters = () => (
    <div className="space-y-4 pt-4">
      <Input placeholder="Duration" value={filters.duration} onChange={e => handleFilterChange('duration', e.target.value)} />
      <Input placeholder="Distance from Haram" value={filters.distanceFromHaram} onChange={e => handleFilterChange('distanceFromHaram', e.target.value)} />
      <Input placeholder="Distance from Masjid e Nabawi" value={filters.distanceFromMasjidENabawi} onChange={e => handleFilterChange('distanceFromMasjidENabawi', e.target.value)} />
      <Input placeholder="Food" value={filters.food} onChange={e => handleFilterChange('food', e.target.value)} />
      <Input placeholder="Airlines" value={filters.airlines} onChange={e => handleFilterChange('airlines', e.target.value)} />
      <Select onValueChange={value => handleFilterChange('category', value === 'all' ? '' : value)} value={filters.category}>
        <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {packageCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
        </SelectContent>
      </Select>
      <div>
        <label className="text-sm font-medium">Price Range</label>
        <Slider
          min={0}
          max={500000}
          step={1000}
          value={filters.priceRange}
          onValueChange={value => handleFilterChange('priceRange', value)}
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>INR {filters.priceRange[0].toLocaleString()}</span>
          <span>INR {filters.priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );


  return (
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Our Packages</h1>
            <div className="flex items-center gap-4">
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            {renderFilters()}
                        </SheetContent>
                    </Sheet>
                </div>
                <Link href="/home" passHref>
                    <Button variant="outline">
                        <Home className="mr-2 h-4 w-4" />
                        Home
                    </Button>
                </Link>
            </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="hidden md:block bg-muted/20 p-6 rounded-lg self-start">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          {renderFilters()}
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <PackageCard 
                key={pkg.id}
                package={pkg} 
                onCompareToggle={toggleCompare} 
                onMoreInfo={() => {}}
                isSelected={comparisonPackages.some(p => p.id === pkg.id)}
            />
          ))}
        </div>
      </div>

      {comparisonPackages.length > 0 && (
        <div className="fixed bottom-10 right-10 z-50">
          <Button onClick={() => setIsComparisonDialogOpen(true)} size="lg" className="shadow-lg">
            Compare ({comparisonPackages.length})
          </Button>
        </div>
      )}

      <ComparisonDialog
        packages={comparisonPackages}
        open={isComparisonDialogOpen}
        onOpenChange={setIsComparisonDialogOpen}
      />
    </div>
  );
}
