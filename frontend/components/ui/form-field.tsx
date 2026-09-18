import type { ReactNode } from 'react';
import styles from './ui.module.css';

interface FormFieldProps {
  children: ReactNode;
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
}

export function FormField({ children, label, htmlFor, hint, className }: FormFieldProps) {
  return (
    <div className={[styles.field, className ?? ''].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={htmlFor}>{label}</label>
      {children}
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
}
