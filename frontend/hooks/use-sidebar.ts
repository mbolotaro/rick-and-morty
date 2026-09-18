'use client';

import { useCallback, useState } from 'react';
import type { FocusEvent } from 'react';

export interface SidebarState {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  handleFocus: () => void;
  handleBlur: (event: FocusEvent<HTMLElement>) => void;
}

export function useSidebar(): SidebarState {
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const expand = useCallback(() => setIsHovered(true), []);
  const collapse = useCallback(() => setIsHovered(false), []);
  const handleFocus = useCallback(() => setHasFocus(true), []);
  const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;

    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setHasFocus(false);
    }
  }, []);

  return {
    isExpanded: isHovered || hasFocus,
    expand,
    collapse,
    handleFocus,
    handleBlur,
  };
}
