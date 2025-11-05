
'use client';

import { useComparisonContext } from '@/components/comparison-provider';

export function useComparison() {
  return useComparisonContext();
}
