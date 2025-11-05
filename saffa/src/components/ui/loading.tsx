'use client';

import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}
