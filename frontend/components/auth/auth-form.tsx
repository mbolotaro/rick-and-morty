'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useAuthForm, type AuthMode } from '@/hooks/use-auth-form';
import styles from './auth-form.module.css';

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const form = useAuthForm(mode);
  const t = useTranslations('Auth');
  const isSignUp = mode === 'sign-up';

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <aside className={styles.visualPanel}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandImage}>
              <Image src="/images/pickle-rick.webp" alt="" fill sizes="54px" />
            </span>
            <strong>Pickle<span>Verso</span></strong>
          </Link>

          <div className={styles.visualCopy}>
            <span className={styles.eyebrow}><Sparkles size={14} /> {t('portalAccess')}</span>
            <h2>{t('welcomeTitle')}</h2>
            <p>{t('welcomeDescription')}</p>
          </div>

          <Image
            className={styles.pickle}
            src="/images/pickle-rick.webp"
            alt=""
            width={290}
            height={390}
            priority
          />
        </aside>

        <div className={styles.formPanel}>
          <header className={styles.formHeader}>
            <span className={styles.eyebrow}>{t(isSignUp ? 'registerEyebrow' : 'loginEyebrow')}</span>
            <h1>{t(isSignUp ? 'registerTitle' : 'loginTitle')}</h1>
            <p>{t(isSignUp ? 'registerDescription' : 'loginDescription')}</p>
          </header>

          <form className={styles.form} onSubmit={form.submit} aria-busy={form.isPending}>
            {isSignUp && (
              <div className={styles.nameFields}>
                <FormField label={t('firstName')} htmlFor="firstName">
                  <Input id="firstName" required name="firstName" autoComplete="given-name" placeholder={t('firstName')} controlSize="large" startIcon={<UserRound size={17} />} />
                </FormField>
                <FormField label={t('lastName')} htmlFor="lastName">
                  <Input id="lastName" required name="lastName" autoComplete="family-name" placeholder={t('lastName')} controlSize="large" startIcon={<UserRound size={17} />} />
                </FormField>
              </div>
            )}

            <FormField label={t('email')} htmlFor="email">
              <Input id="email" required name="email" type="email" autoComplete="email" placeholder="portal@pickleverso.com" controlSize="large" startIcon={<Mail size={17} />} />
            </FormField>

            <FormField label={t('password')} htmlFor="password">
              <Input
                id="password"
                required
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                minLength={isSignUp ? 8 : 1}
                placeholder="••••••••"
                controlSize="large"
                startIcon={<LockKeyhole size={17} />}
              />
            </FormField>

            <Button disabled={form.isPending} type="submit" size="large" fullWidth>
              {form.isPending
                ? t(isSignUp ? 'signingUp' : 'signingIn')
                : t(isSignUp ? 'signUp' : 'signIn')}
              {!form.isPending && <ArrowRight size={18} />}
            </Button>
          </form>

          <p className={styles.switchMode}>
            {t(isSignUp ? 'hasAccountPrompt' : 'noAccountPrompt')}{' '}
            <Link href={isSignUp ? '/login' : '/register'}>
              {t(isSignUp ? 'alreadyHaveAccount' : 'createAccount')}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
