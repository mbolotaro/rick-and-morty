'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useSelect } from '@/hooks/use-select';
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
  const items = [{ label: placeholder, value: EMPTY_VALUE }, ...options];
  const initialValue = defaultValue || EMPTY_VALUE;
  const {
    handleOptionKeyDown,
    handleTriggerKeyDown,
    isOpen,
    listboxId,
    optionRefs,
    rootRef,
    select,
    triggerRef,
    value,
    open,
    close,
  } = useSelect({ initialValue, optionValues: items.map((item) => item.value) });
  const submittedValue = value === EMPTY_VALUE ? '' : value;
  const selectedItem = items.find((item) => item.value === value) ?? items[0];

  return (
    <div className={[styles.selectRoot, className ?? ''].filter(Boolean).join(' ')} ref={rootRef}>
      <input type="hidden" name={name} value={submittedValue} />
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        id={id}
        aria-label={ariaLabel}
        className={styles.selectTrigger}
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        <span>{selectedItem.label}</span>
        <ChevronDown className={styles.selectChevron} size={16} />
      </button>

      {isOpen ? (
        <div aria-labelledby={id} className={styles.selectMenu} id={listboxId} role="listbox">
          {items.map((item, index) => {
            const isSelected = item.value === value;

            return (
              <button
                aria-selected={isSelected}
                className={styles.selectItem}
                key={item.value}
                onClick={() => select(item.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index, item.value)}
                ref={(element) => { optionRefs.current[index] = element; }}
                role="option"
                type="button"
              >
                <span>{item.label}</span>
                {isSelected ? <Check className={styles.selectIndicator} size={14} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
