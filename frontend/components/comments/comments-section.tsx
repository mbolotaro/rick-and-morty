import { UserRound } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { getComments } from '@/lib/comments/server';
import type { FavoriteResource } from '@/lib/favorites/types';
import { CommentForm } from './comment-form';
import { RatingButton } from './rating-button';
import styles from './comments.module.css';

interface CommentsSectionProps {
  resource: FavoriteResource;
  externalId: number;
}

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export async function CommentsSection({ resource, externalId }: CommentsSectionProps) {
  const [comments, locale, t] = await Promise.all([
    getComments(resource, externalId),
    getLocale(),
    getTranslations('Comments'),
  ]);

  return (
    <section className={styles.commentsSection}>
      <header className={styles.sectionHeader}>
        <div>
          <span>{t('discussion')}</span>
          <h2>{t('title')}</h2>
        </div>
        <strong>{comments.length}</strong>
      </header>

      <CommentForm resource={resource} externalId={externalId} />

      <div className={styles.commentList}>
        {comments.length === 0 && (
          <p className={styles.emptyMessage}>{t('empty')}</p>
        )}

        {comments.map((comment) => (
          <article className={styles.commentCard} key={comment.id}>
            <span className={styles.avatar} aria-hidden="true"><UserRound size={17} /></span>
            <div className={styles.commentBody}>
              <header>
                <strong>{comment.author.firstName} {comment.author.lastName}</strong>
                <time dateTime={comment.createdAt}>{formatDate(comment.createdAt, locale)}</time>
              </header>
              <p>{comment.content}</p>
              <footer>
                <RatingButton comment={comment} resource={resource} externalId={externalId} value="UP" />
                <RatingButton comment={comment} resource={resource} externalId={externalId} value="DOWN" />
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
