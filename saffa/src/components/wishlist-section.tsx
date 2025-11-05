'use client';

import { useState, useEffect } from 'react';
import type { Package, UserProfile } from '@/lib/types';
import { getWishlistPackages, removeFromWishlist } from '@/app/actions';
import { PackageList } from '@/components/package-list-detailed';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type WishlistSectionProps = {
  user: UserProfile;
};

export function WishlistSection({ user }: WishlistSectionProps) {
  const [wishlistPackages, setWishlistPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user?.uid) {
        setLoading(true);
        const packages = await getWishlistPackages(user.uid);
        setWishlistPackages(packages);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleRemoveFromWishlist = async (packageId: string) => {
    if (!user?.uid) return;

    const result = await removeFromWishlist(user.uid, packageId);
    if (result.success) {
      setWishlistPackages(prev => prev.filter(p => p.id !== packageId));
      toast({
        title: 'Removed from Wishlist',
        description: 'The package has been removed from your wishlist.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Remove',
        description: result.error || 'There was a problem removing the package from your wishlist.',
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-2 text-muted-foreground">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div>
        <h3 className="text-lg font-semibold">Your Wishlist</h3>
        {wishlistPackages.length > 0 ? (
            <div className="mt-4">
                <PackageList packages={wishlistPackages} onRemove={handleRemoveFromWishlist} />
            </div>
        ) : (
            <p className="text-muted-foreground mt-2">Your wishlist is empty.</p>
        )}
    </div>
  );
}
