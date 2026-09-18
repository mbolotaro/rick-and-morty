import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './sidebar.module.css';

interface SidebarPortalProps {
  isCollapsed: boolean;
}

export function SidebarPortal({ isCollapsed }: SidebarPortalProps) {
  const t = useTranslations('Sidebar');

  return (
    <div className={styles.portalCard} aria-hidden="true">
      <div className={styles.portalArt}>
        <Image
          src="/images/pickle-rick.webp"
          alt=""
          fill
          sizes={isCollapsed ? '48px' : '150px'}
          className={styles.pickleImage}
        />
      </div>

      {!isCollapsed && (
        <p>
          {t('portalLineOne')}
        </p>
      )}
    </div>
  );
}
