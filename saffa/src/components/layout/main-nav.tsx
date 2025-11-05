'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';

export function MainNav() {
  const { user } = useAuth();
  const router = useRouter();

  const handlePackagesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!user) {
      router.push('/signup?redirect=/packages');
    } else {
      router.push('/packages');
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Logo />
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/about">About</Link>
        <Link href="/packages" onClick={handlePackagesClick}>Packages</Link>
      </nav>
    </div>
  );
}
