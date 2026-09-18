import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './ui.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  startIcon?: ReactNode;
  controlSize?: 'medium' | 'large';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, startIcon, controlSize = 'medium', ...props },
  ref,
) {
  return (
    <div className={[
      styles.inputShell,
      controlSize === 'large' ? styles.largeControl : '',
      className ?? '',
    ].filter(Boolean).join(' ')}>
      {startIcon ? <span className={styles.controlIcon}>{startIcon}</span> : null}
      <input ref={ref} className={styles.input} {...props} />
    </div>
  );
});
