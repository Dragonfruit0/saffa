'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { Package } from '@/lib/types';
import Image from 'next/image';
import { trackBookNowClick } from '@/lib/analytics';
import { useAuth } from '@/hooks/use-auth';

interface PackageCardProps {
  package: Package;
  onCompareToggle: (pkg: Package, isSelected: boolean) => void;
  isSelected: boolean;
  isCompareMode: boolean;
}

const imageUrls = [
  "https://images.unsplash.com/photo-1583908332152-423588f21952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1563653765136-e39e03507963?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1605221912995-58d34b3c468a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://hajjumrahplanner.com/wp-content/uploads/2023/07/Tawaf-e-Ziarat-1-1024x683.jpg",
  "https://cdn.bookmyumrahtrip.com/media/pexels_hafiz_humayun_khan_553080428_19603975.jpg",
  "https://cdn.bookmyumrahtrip.com/media/mecca_kaaba_close.jpg",
  "https://cdn.bookmyumrahtrip.com/media/pexels_hafiz_humayun_khan_553080428_19603975.jpg",
  "https://hajjumrahplanner.com/wp-content/uploads/2017/02/tawaf-ground.jpg"
];

export function PackageCard({ package: pkg, onCompareToggle, isSelected, isCompareMode }: PackageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  
  const getIndexFromId = (id: string) => {
    if (!id) return 0;
    return id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % imageUrls.length;
  };
  
  const imageUrl = imageUrls[getIndexFromId(pkg.id)] || imageUrls[0];

  const handleBookNow = async () => {
    if (!user) {
      router.push('/signup');
      return;
    }
    await trackBookNowClick(pkg, user);
    const message = `I came from Safamarwah.in and I'm interested in the ${pkg.name} package.\n\nHere are the details:\n- Price: INR ${pkg.price.toLocaleString('en-IN')}\n- Duration: ${pkg.duration}\n- Distance from Haram: ${pkg.distanceFromHaram}\n- Distance from Masjid e Nabawi: ${pkg.distanceFromMasjidENabawi}`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=919908829096&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const handleMoreInfo = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden relative">
      {isCompareMode && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onCompareToggle(pkg, !!checked)}
            className="bg-white border-gray-400"
          />
        </div>
      )}
      <Image src={imageUrl} alt={pkg.name} width={400} height={250} className="object-cover w-full h-48" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{pkg.name}</h3>
        <p className="text-sm text-muted-foreground">{pkg.duration}</p>
        <p className="text-lg font-semibold mt-2">INR{pkg.price.toLocaleString()}</p>
        <div className="mt-4 flex justify-between space-x-2">
          <Button variant="outline" onClick={handleMoreInfo}>More Info</Button>
          <Button onClick={handleBookNow}>Book Now</Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{pkg.name}</DialogTitle>
            <DialogDescription>{pkg.description}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <Image src={imageUrl} alt={pkg.name} width={600} height={400} className="object-cover rounded-lg w-full" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Package Details</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Duration:</strong> {pkg.duration}</li>
                <li><strong>Haram Distance:</strong> {pkg.distanceFromHaram}</li>
                <li><strong>Masjid e Nabawi Distance:</strong> {pkg.distanceFromMasjidENabawi}</li>
                <li><strong>Food:</strong> {pkg.food}</li>
                <li><strong>Airlines:</strong> {pkg.airlines}</li>
                <li><strong>Departure:</strong> {pkg.departureLocation}</li>
              </ul>
              <p className="text-2xl font-bold mt-4">INR{pkg.price.toLocaleString()}</p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
            <Button onClick={handleBookNow}>Book Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
