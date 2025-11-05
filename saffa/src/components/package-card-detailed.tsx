'use client';

import { useState } from 'react';
import type { Package } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { addToWishlist } from '@/app/actions';
import { useAuth } from '@/hooks/use-auth';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart } from 'lucide-react';

type PackageCardProps = {
  package: Package;
  onCompareToggle?: (pkg: Package, isSelected: boolean) => void;
  isSelected?: boolean;
  isCompareMode?: boolean;
  onRemove?: (pkgId: string) => void;
  onMoreInfo?: (pkg: Package) => void;
  onBookNow?: (pkg: Package) => void;
};

export function PackageCard({ package: pkg, onCompareToggle, isSelected, isCompareMode, onRemove, onMoreInfo, onBookNow }: PackageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'You need to be logged in to add items to your wishlist.',
      });
      return;
    }

    const result = await addToWishlist(user.uid, pkg.id);
    if (result.success) {
      toast({
        title: 'Added to Wishlist',
        description: `The package "${pkg.name}" has been added to your wishlist.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Add',
        description: result.error || 'There was a problem adding the package to your wishlist.',
      });
    }
  };

  const handleBookNowClick = () => {
    if (onBookNow) {
        onBookNow(pkg)
    }
  };
  
  const handleMoreInfo = () => {
    if (onMoreInfo) {
      onMoreInfo(pkg);
    }
    setIsModalOpen(true);
  }

  return (
    <div className="rounded-lg border bg-background shadow-lg transition-transform hover:scale-105">
       {isCompareMode && onCompareToggle && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onCompareToggle(pkg, !!checked)}
            className="bg-white border-gray-400"
          />
        </div>
      )}
      <Carousel className="relative h-56 w-full">
        <CarouselContent>
          {(pkg.imageUrls || []).map((url, index) => (
            <CarouselItem key={index}>
              <Image 
                src={url} 
                alt={`${pkg.name} image ${index + 1}`} 
                fill 
                className="object-cover rounded-t-lg" 
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute top-2 right-2 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground">
          {pkg.category}
        </div>
      </Carousel>
      <div className="p-4">
        <h3 className="text-lg font-bold">{pkg.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{pkg.duration}</p>
        <p className="mt-2 text-base text-muted-foreground line-clamp-2">{pkg.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-primary">INR {pkg.price.toLocaleString()}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleAddToWishlist}>
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleMoreInfo}>More Info</Button>
            <Button onClick={handleBookNowClick}>Book Now</Button>
          </div>
        </div>
         {onRemove && (
          <div className="mt-4 flex justify-end">
            <Button variant="destructive" size="sm" onClick={() => onRemove(pkg.id)}>Remove</Button>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{pkg.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Carousel className="relative h-64 w-full">
              <CarouselContent>
                {(pkg.imageUrls || []).map((url, index) => (
                  <CarouselItem key={index}>
                    <Image 
                      src={url} 
                      alt={`${pkg.name} image ${index + 1}`} 
                      fill 
                      className="object-cover rounded-lg" 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <p className="text-muted-foreground">{pkg.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Duration:</strong> {pkg.duration}</p>
                <p><strong>Category:</strong> {pkg.category}</p>
                <p><strong>Departure:</strong> {pkg.departureLocation}</p>
                <p><strong>Haram Distance:</strong> {pkg.distanceFromHaram}</p>
                <p><strong>Masjid e Nabawi Distance:</strong> {pkg.distanceFromMasjidENabawi}</p>
                <p><strong>Food:</strong> {pkg.food}</p>
                <p><strong>Airlines:</strong> {pkg.airlines}</p>
            </div>
            <p className="text-2xl font-bold text-primary text-center">INR {pkg.price.toLocaleString()}</p>
          </div>
          <DialogFooter className="mt-6 sm:justify-between">
            <Button variant="secondary" onClick={handleAddToWishlist}>Add to Wishlist</Button>
            <div className="flex gap-2">
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
                <Button onClick={handleBookNowClick}>Book Now</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
