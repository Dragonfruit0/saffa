import Image from "next/image";
import type { Package } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plane, Clock, MapPin } from "lucide-react";

interface ChatPackageCardProps {
  package: Package;
}

export function ChatPackageCard({ package: pkg }: ChatPackageCardProps) {
  return (
    <div className="flex gap-4 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden w-full max-w-lg">
      <div className="relative h-full w-24 flex-shrink-0">
        <Image 
          src={(pkg.imageUrls || [])[0]} 
          alt={pkg.name} 
          fill 
          className="object-cover" 
        />
      </div>
      <div className="flex flex-col justify-between p-3 flex-grow">
        <div>
            <h3 className="text-sm font-semibold tracking-tight leading-snug">{pkg.name}</h3>
            <p className="text-lg font-bold text-primary mt-1">INR {pkg.price.toLocaleString('en-IN')}</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-primary/80" />
                    <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-primary/80" />
                    <span>{pkg.distanceFromHaram} from Haram</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="w-full h-8 text-xs">Compare</Button>
            <Button size="sm" className="w-full h-8 text-xs bg-accent text-accent-foreground hover:bg-accent/90">More Info</Button>
        </div>
      </div>
    </div>
  );
}
