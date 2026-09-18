import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './ui.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'unstyled';
type ButtonSize = 'small' | 'medium' | 'large' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    variant !== 'unstyled' ? styles.button : '',
    variant !== 'unstyled' ? styles[variant] : '',
    variant !== 'unstyled' ? styles[size] : '',
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return <button className={classes} type={type} {...props}>{children}</button>;
}
