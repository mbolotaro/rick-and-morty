import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell/app-shell';
import { TopbarBoundary } from '@/components/app-shell/topbar';

interface CatalogShellProps {
  children: ReactNode;
}

export function CatalogShell({ children }: CatalogShellProps) {
  return (
    <AppShell>
      <TopbarBoundary />
      {children}
    </AppShell>
  );
}
