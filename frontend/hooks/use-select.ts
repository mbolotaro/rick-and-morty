'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface UseSelectParams {
  initialValue: string;
  optionValues: readonly string[];
}

export function useSelect({ initialValue, optionValues }: UseSelectParams) {
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pendingFocusIndex = useRef<number | null>(null);
  const listboxId = useId();
  const optionCount = optionValues.length;
  const selectedIndex = Math.max(0, optionValues.indexOf(value));

  const focusOption = (index: number) => {
    requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const open = (focusIndex = selectedIndex) => {
    pendingFocusIndex.current = focusIndex;
    setIsOpen(true);
  };

  const close = (restoreFocus = false) => {
    setIsOpen(false);
    pendingFocusIndex.current = null;

    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const select = (nextValue: string) => {
    setValue(nextValue);
    close(true);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      open(Math.min(selectedIndex + 1, optionCount - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      open(Math.max(selectedIndex - 1, 0));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      open(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      open(optionCount - 1);
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    optionValue: string,
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(Math.min(index + 1, optionCount - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusOption(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusOption(optionCount - 1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(optionValue);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const focusIndex = pendingFocusIndex.current ?? selectedIndex;
    focusOption(focusIndex);
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && !rootRef.current?.contains(target)) {
        close(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  return {
    close,
    handleOptionKeyDown,
    handleTriggerKeyDown,
    isOpen,
    listboxId,
    open,
    optionRefs,
    rootRef,
    select,
    triggerRef,
    value,
  };
}
