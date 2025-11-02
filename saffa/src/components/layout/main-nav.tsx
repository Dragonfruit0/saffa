'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export function MainNav() {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Logo />
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/about">About</Link>
        <Link href="/packages">Packages</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </div>
  );
}
