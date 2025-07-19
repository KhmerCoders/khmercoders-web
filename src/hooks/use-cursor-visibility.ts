'use client';

import * as React from 'react';
import type { Editor } from '@tiptap/react';
import { useWindowSize } from '@/hooks/use-window-size';

export interface CursorVisibilityOptions {
  /**
   * The Tiptap editor instance
   */
  editor?: Editor | null;
  /**
   * Reference to the toolbar element that may obscure the cursor
   */
  overlayHeight?: number;
}

export type RectState = Omit<DOMRect, 'toJSON'>;

/**
 * Custom hook that ensures the cursor remains visible when typing in a Tiptap editor.
 * Automatically scrolls the window when the cursor would be hidden by the toolbar.
 *
 * This is particularly useful for long-form content editing where the cursor
 * might move out of the visible area as the user types.
 *
 * @param options Configuration options for cursor visibility behavior
 * @param options.editor The Tiptap editor instance
 * @param options.overlayHeight Reference to the toolbar element that may obscure the cursor
 * @returns void
 */
export function useCursorVisibility({ editor, overlayHeight = 0 }: CursorVisibilityOptions) {
  const { height: windowHeight } = useWindowSize();
  const [rect, setRect] = React.useState<RectState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const updateRect = React.useCallback(() => {
    const element = document.body;

    const DOMRect = element.getBoundingClientRect();
    setRect(DOMRect);
  }, []);

  React.useEffect(() => {
    const element = document.body;

    updateRect();

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(updateRect);
    });

    resizeObserver.observe(element);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateRect);
    };
  }, [updateRect]);

  React.useEffect(() => {
    const ensureCursorVisibility = () => {
      if (!editor) return;

      const { state, view } = editor;

      if (!view.hasFocus()) return;

      // Get current cursor position coordinates
      const { from } = state.selection;
      const cursorCoords = view.coordsAtPos(from);

      if (windowHeight < rect.height) {
        if (cursorCoords) {
          // Check if there's enough space between cursor and bottom of window
          const availableSpace = windowHeight - cursorCoords.top;

          // If not enough space, scroll to position cursor in the middle of viewport
          if (availableSpace < overlayHeight) {
            // Calculate target scroll position to center cursor in viewport
            // Account for overlay height to ensure cursor is not hidden
            const targetCursorY = Math.max(windowHeight / 2, overlayHeight);

            // Get current scroll position and cursor's absolute position
            const currentScrollY = window.scrollY;
            const cursorAbsoluteY = cursorCoords.top + currentScrollY;

            // Calculate new scroll position
            const newScrollY = cursorAbsoluteY - targetCursorY;

            window.scrollTo({
              top: Math.max(0, newScrollY),
              behavior: 'smooth',
            });
          }
        }
      }
    };

    ensureCursorVisibility();
  }, [editor, overlayHeight, windowHeight, rect.height]);

  return rect;
}
