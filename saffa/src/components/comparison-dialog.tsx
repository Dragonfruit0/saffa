'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Package } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ComparisonDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  packages: Package[];
}

export function ComparisonDialog({ isOpen, onOpenChange, packages }: ComparisonDialogProps) {
  if (packages.length < 1) return null;

  const features = [
    { key: 'price', label: 'Price', render: (pkg: Package) => `INR ${pkg.price.toLocaleString('en-IN')}` },
    { key: 'duration', label: 'Duration', render: (pkg: Package) => pkg.duration },
    { key: 'airline', label: 'Airline', render: (pkg: Package) => pkg.airline },
    { key: 'distanceFromHaram', label: 'Distance from Haram', render: (pkg: Package) => pkg.distanceFromHaram },
    { key: 'distanceFromMasjidENabawi', label: 'Distance from Masjid e Nabawi', render: (pkg: Package) => pkg.distanceFromMasjidENabawi },
    { key: 'food', label: 'Food', render: (pkg: Package) => pkg.food },
    { key: 'category', label: 'Category', render: (pkg: Package) => pkg.category },
    { key: 'departureLocation', label: 'Departure', render: (pkg: Package) => pkg.departureLocation },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Compare Packages</DialogTitle>
        </DialogHeader>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-semibold w-1/4">Feature</th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="p-4 text-center font-semibold w-1/4 border-l">
                    {pkg.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map(({ key, label, render }) => (
                <tr key={key} className="border-b last:border-b-0">
                  <td className="p-4 font-medium w-1/4">{label}</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 text-center w-1/4 border-l">
                      {render(pkg)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter className="mt-8 sm:justify-center">
          <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
