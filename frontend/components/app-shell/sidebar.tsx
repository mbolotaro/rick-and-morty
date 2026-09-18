'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { FocusEventHandler, MouseEventHandler } from 'react';
import { useActiveRoute } from '@/hooks/use-active-route';
import { sidebarItems } from './sidebar-navigation';
import { SidebarBrand } from './sidebar-brand';
import { SidebarPortal } from './sidebar-portal';
import styles from './sidebar.module.css';

interface SidebarProps {
  isCollapsed: boolean;
  onMouseEnter: MouseEventHandler<HTMLElement>;
  onMouseLeave: MouseEventHandler<HTMLElement>;
  onFocus: FocusEventHandler<HTMLElement>;
  onBlur: FocusEventHandler<HTMLElement>;
}

export function Sidebar({
  isCollapsed,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: SidebarProps) {
  const isActive = useActiveRoute();
  const t = useTranslations('Sidebar');

  return (
    <aside
      className={styles.sidebar}
      aria-label={t('navigation')}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className={styles.header}>
        <SidebarBrand isCollapsed={isCollapsed} />
      </div>

      <nav className={styles.navigation}>
        {sidebarItems.map(({ href, label, icon: Icon }) => (
          <Link
            className={isActive(href) ? styles.activeLink : styles.link}
            href={href}
            key={href}
            title={isCollapsed ? t(label) : undefined}
            aria-current={isActive(href) ? 'page' : undefined}
          >
            <Icon className={styles.icon} size={20} strokeWidth={1.8} />
            <span className={styles.label}>{t(label)}</span>
          </Link>
        ))}
      </nav>

      <SidebarPortal isCollapsed={isCollapsed} />
    </aside>
  );
}
