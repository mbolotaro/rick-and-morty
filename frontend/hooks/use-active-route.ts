'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function useActiveRoute(): (href: string) => boolean {
  const pathname = usePathname();

  return useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );
}
