'use client';

import type { Package } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X } from 'lucide-react';

interface ComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packages: Package[];
}

const comparisonFields: { key: keyof Package; label: string; isBoolean?: boolean }[] = [
  { key: 'price', label: 'Price' },
  { key: 'duration', label: 'Duration' },
  { key: 'airline', label: 'Airline' },
  { key: 'distanceFromHaram', label: 'Distance from Haram' },
  { key: 'food', label: 'Food' },
  { key: 'ziyaratGuide', label: 'Ziyarat Guide', isBoolean: true },
  { key: 'departureLocation', label: 'Departure' },
];

export function ComparisonDialog({ open, onOpenChange, packages }: ComparisonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Compare Packages</DialogTitle>
          <DialogDescription>
            Here's a side-by-side look at the packages you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="font-semibold w-[150px]">Feature</TableHead>
                  {packages.map((pkg) => (
                    <TableHead key={pkg.id} className="font-semibold">{pkg.packageName}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFields.map((field) => (
                  <TableRow key={field.key}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    {packages.map((pkg) => (
                      <TableCell key={pkg.id}>
                        {field.isBoolean ? (
                          pkg[field.key] ? 
                          <Check className="h-5 w-5 text-green-600" /> : 
                          <X className="h-5 w-5 text-red-600" />
                        ) : field.key === 'price' ? (
                          <span dangerouslySetInnerHTML={{ __html: `&#8377;${pkg[field.key].toLocaleString('en-IN')}` }} />
                        ) : (
                          String(pkg[field.key])
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
