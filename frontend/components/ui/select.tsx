'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import styles from './ui.module.css';

const EMPTY_VALUE = '__all_options__';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  name: string;
  defaultValue?: string;
  placeholder: string;
  options: readonly SelectOption[];
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  id,
  name,
  defaultValue,
  placeholder,
  options,
  ariaLabel,
  disabled = false,
  className,
}: SelectProps) {
  const [value, setValue] = useState(defaultValue || EMPTY_VALUE);
  const submittedValue = value === EMPTY_VALUE ? '' : value;

  return (
    <>
      <input type="hidden" name={name} value={submittedValue} />
      <SelectPrimitive.Root value={value} onValueChange={setValue} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={id}
          aria-label={ariaLabel}
          className={[styles.selectTrigger, className ?? ''].filter(Boolean).join(' ')}
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon className={styles.selectChevron}>
            <ChevronDown size={16} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={styles.selectContent}
            position="popper"
            sideOffset={7}
            collisionPadding={10}
          >
            <SelectPrimitive.ScrollUpButton className={styles.selectScrollButton}>
              <ChevronUp size={15} />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className={styles.selectViewport}>
              <SelectPrimitive.Item className={styles.selectItem} value={EMPTY_VALUE}>
                <SelectPrimitive.ItemText>{placeholder}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className={styles.selectIndicator}>
                  <Check size={14} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
              {options.map((option) => (
                <SelectPrimitive.Item
                  className={styles.selectItem}
                  value={option.value}
                  key={option.value}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className={styles.selectIndicator}>
                    <Check size={14} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className={styles.selectScrollButton}>
              <ChevronDown size={15} />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </>
  );
}
