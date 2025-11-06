'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex h-full flex-col py-6">
            <div className="mb-8 flex items-center justify-end">
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
            </div>
            <nav className="flex flex-col space-y-4 px-4">
              <Link href="/about" className="py-2 text-lg" onClick={() => setIsOpen(false)}>About</Link>
              <Link href="/packages" className="py-2 text-lg" onClick={() => setIsOpen(false)}>Packages</Link>
              <Link href="/contact" className="py-2 text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
