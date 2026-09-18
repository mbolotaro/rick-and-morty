'use client';

import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useFavorite } from '@/hooks/use-favorite';
import type { FavoriteResource } from '@/lib/favorites/types';
import styles from './favorites.module.css';

interface FavoriteButtonProps {
  resource: FavoriteResource;
  externalId: number;
  liked: boolean;
}

export function FavoriteButton({ resource, externalId, liked }: FavoriteButtonProps) {
  const favorite = useFavorite({ resource, externalId, initialLiked: liked });
  const t = useTranslations('Favorites');

  return (
    <Button
      className={styles.favoriteButton}
      variant="unstyled"
      data-liked={favorite.liked}
      disabled={favorite.isPending}
      type="button"
      onClick={() => favorite.toggle()}
      aria-label={favorite.liked ? t('removeLabel') : t('addLabel')}
    >
      <Heart size={18} fill={favorite.liked ? 'currentColor' : 'none'} />
      {favorite.liked ? t('remove') : t('add')}
    </Button>
  );
}
