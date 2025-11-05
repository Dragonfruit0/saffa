
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Package } from '@/lib/types';

interface ComparisonContextType {
  packages: Package[];
  isCompareMode: boolean;
  addPackage: (pkg: Package) => void;
  removePackage: (pkgId: string) => void;
  toggleCompareMode: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isCompareMode, setCompareMode] = useState(false);

  const addPackage = useCallback((pkg: Package) => {
    setPackages(prev => [...prev, pkg]);
  }, []);

  const removePackage = useCallback((pkgId: string) => {
    setPackages(prev => prev.filter(p => p.id !== pkgId));
  }, []);

  const toggleCompareMode = useCallback(() => {
    setCompareMode(prev => !prev);
    if (isCompareMode) {
      setPackages([]);
    }
  }, [isCompareMode]);

  const value = { packages, isCompareMode, addPackage, removePackage, toggleCompareMode };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparisonContext() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparisonContext must be used within a ComparisonProvider');
  }
  return context;
}
