import { cn } from '@/lib/utils';
import Link from 'next/link';

const MosqueIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12v8h20v-8" />
    <path d="M4 20V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10" />
    <path d="M12 4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M8 20v-4" />
    <path d="M16 20v-4" />
  </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/home" className={cn("flex items-center gap-2 text-foreground", className)}>
      <MosqueIcon className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tight">
        SafaMarwah.in
      </span>
    </Link>
  );
}
