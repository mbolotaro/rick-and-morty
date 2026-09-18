'use client';

import type { ReactNode } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import { Sidebar } from './sidebar';
import styles from './app-shell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const sidebar = useSidebar();
  const isCollapsed = !sidebar.isExpanded;

  return (
    <div className={styles.shell} data-sidebar-collapsed={isCollapsed}>
      <Sidebar
        isCollapsed={isCollapsed}
        onMouseEnter={sidebar.expand}
        onMouseLeave={sidebar.collapse}
        onFocus={sidebar.handleFocus}
        onBlur={sidebar.handleBlur}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
