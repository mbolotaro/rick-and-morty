'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useCommentRating } from '@/hooks/use-comment-rating';
import type { Comment, CommentRate } from '@/lib/comments/types';
import type { FavoriteResource } from '@/lib/favorites/types';
import styles from './comments.module.css';

interface RatingButtonProps {
  comment: Comment;
  resource: FavoriteResource;
  externalId: number;
  value: CommentRate;
}

export function RatingButton({ comment, resource, externalId, value }: RatingButtonProps) {
  const isUp = value === 'UP';
  const active = comment.rating.current === value;
  const count = isUp ? comment.rating.up : comment.rating.down;
  const Icon = isUp ? ThumbsUp : ThumbsDown;
  const t = useTranslations('Comments');
  const rating = useCommentRating({
    resource,
    externalId,
    commentId: comment.id,
    value,
  });

  return (
    <Button
      className={styles.ratingButton}
      variant="unstyled"
      data-active={active}
      disabled={rating.isPending}
      type="button"
      onClick={() => rating.rate()}
      aria-label={isUp ? t('upvote') : t('downvote')}
    >
      <Icon size={15} fill={active ? 'currentColor' : 'none'} />
      {count}
    </Button>
  );
}
