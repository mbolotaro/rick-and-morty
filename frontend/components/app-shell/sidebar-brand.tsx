import Image from 'next/image';
import styles from './sidebar.module.css';
import { useTranslations } from 'next-intl';

interface SidebarBrandProps {
  isCollapsed: boolean;
}

export function SidebarBrand({ isCollapsed }: SidebarBrandProps) {
  const t = useTranslations('Sidebar');

  return (
    <div className={styles.brand}>
      <span className={styles.brandMark} aria-hidden="true">
        <Image
          src="/images/pickle-rick.webp"
          alt=""
          fill
          sizes="46px"
          className={styles.brandImage}
        />
      </span>

      {!isCollapsed && (
        <span className={styles.brandCopy}>
          <strong>
            Pickle<span>Verso</span>
          </strong>
          <small>{t('tagline')}</small>
        </span>
      )}
    </div>
  );
}
