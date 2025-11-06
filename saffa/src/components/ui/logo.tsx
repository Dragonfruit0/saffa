import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/home" className={cn("flex items-center gap-2 text-foreground", className)}>
      <Image src="/images/safamarwahlogo.jpg" alt="SafaMarwah.in Logo" width={32} height={32} />
      <span className="text-xl font-bold font-headline tracking-tight">
        SafaMarwah
      </span>
    </Link>
  );
}
