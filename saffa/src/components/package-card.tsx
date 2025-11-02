'use client';

import Image from "next/image";
import type { Package } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plane, Clock, Utensils, MapPin } from "lucide-react";

interface PackageCardProps {
  package: Package;
  onCompareToggle: (pkg: Package) => void;
  isSelected: boolean;
}

export function PackageCard({ package: pkg, onCompareToggle, isSelected }: PackageCardProps) {
  const handleCheckedChange = () => {
    onCompareToggle(pkg);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image 
          src={pkg.imageUrl} 
          alt={pkg.name} 
          data-ai-hint={pkg.imageHint}
          fill 
          className="object-cover" 
        />
         <Badge className="absolute top-2 right-2">{pkg.category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-headline tracking-tight">{pkg.name}</CardTitle>
        <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">INR {pkg.price.toLocaleString('en-IN')}</p>
            <span className="text-sm text-muted-foreground">/person</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 text-primary/80" />
          <span>{pkg.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Plane className="h-4 w-4 text-primary/80" />
          <span>{pkg.airline}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary/80" />
          <span>{pkg.distanceFromHaram} from Haram</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary/80" />
            <span>{pkg.distanceFromMasjidENabawi} from Masjid e Nabawi</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Utensils className="h-4 w-4 text-primary/80" />
          <span>Food: {pkg.food}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/40 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 ml-auto">
          <Checkbox 
            id={`compare-${pkg.id}`} 
            checked={isSelected} 
            onCheckedChange={handleCheckedChange}
          />
          <Label htmlFor={`compare-${pkg.id}`} className="text-sm font-medium cursor-pointer">
            Compare
          </Label>
        </div>
      </CardFooter>
    </Card>
  );
}
