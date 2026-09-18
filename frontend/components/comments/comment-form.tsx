'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { useCommentForm } from '@/hooks/use-comment-form';
import { COMMENT_MAX_LENGTH } from '@/lib/comments/types';
import type { FavoriteResource } from '@/lib/favorites/types';
import styles from './comments.module.css';

interface CommentFormProps {
  resource: FavoriteResource;
  externalId: number;
}

export function CommentForm({ resource, externalId }: CommentFormProps) {
  const form = useCommentForm({ resource, externalId });
  const t = useTranslations('Comments');

  return (
    <form className={styles.commentForm} onSubmit={form.submit}>
      <FormField label={t('add')} htmlFor="comment-content">
        <Textarea
          id="comment-content"
          name="content"
          value={form.content}
          onChange={(event) => form.setContent(event.target.value)}
          maxLength={COMMENT_MAX_LENGTH}
          rows={4}
          placeholder={t('placeholder')}
          required
        />
      </FormField>
      <footer>
        <span data-warning={form.remainingCharacters <= 100}>
          {form.content.length}/{COMMENT_MAX_LENGTH}
        </span>
        <Button size="small" type="submit" disabled={form.isPending || !form.content.trim()}>
          <Send size={16} />
          {form.isPending ? t('submitting') : t('submit')}
        </Button>
      </footer>
    </form>
  );
}
