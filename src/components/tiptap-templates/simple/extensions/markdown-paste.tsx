'use client';

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactDOMServer from 'react-dom/server';

export interface MarkdownPasteOptions {
  /**
   * Whether to enable markdown paste conversion
   * @default true
   */
  enabled: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markdownPaste: {
      /**
       * Enable or disable markdown paste conversion
       */
      setMarkdownPasteEnabled: (enabled: boolean) => ReturnType;
    };
  }
}

// Helper functions outside the extension
const isMarkdownContent = (text: string): boolean => {
  // For multiline content, be more lenient with detection
  if (text.includes('\n') && text.length > 50) {
    // If it's multiline and substantial, check for any markdown patterns
    const markdownPatterns = [
      /^#{1,6}\s+.+/m, // Headers
      /\*\*[^*\n]+\*\*/g, // Bold **text**
      /__[^_\n]+__/g, // Bold __text__
      /\*[^*\n]+\*/g, // Italic *text*
      /_[^_\n]+_/g, // Italic _text_
      /`[^`\n]+`/g, // Inline code
      /```[\s\S]*?```/g, // Code blocks
      /^\s*[-*+]\s+/m, // Unordered lists
      /^\s*\d+\.\s+/m, // Ordered lists
      /^\s*-\s+\[[ x]\]\s+/m, // Task lists
      /\[([^\]]+)\]\(([^)]+)\)/g, // Links
      /!\[([^\]]*)\]\(([^)]+)\)/g, // Images
      /^\s*>\s+/m, // Blockquotes
      /^\s*---+\s*$/m, // Horizontal rules
      /^\s*\|.*\|/m, // Tables
    ];

    return markdownPatterns.some(pattern => pattern.test(text));
  }

  // For shorter content, require more specific patterns
  const strictPatterns = [
    /^#{1,6}\s+.+/m, // Headers
    /\*\*[^*]+\*\*/g, // Bold **text**
    /__[^_]+__/g, // Bold __text__
    /```[\s\S]*?```/g, // Code blocks
    /\[([^\]]+)\]\(([^)]+)\)/g, // Links
    /!\[([^\]]*)\]\(([^)]+)\)/g, // Images
    /^\s*>\s+/m, // Blockquotes
    /^\s*---+\s*$/m, // Horizontal rules
  ];

  return strictPatterns.some(pattern => pattern.test(text));
};

const handleMarkdownPaste = (text: string, view: EditorView) => {
  const processMarkdown = (markdown: string) => {
    try {
      // Render Markdown to HTML using react-markdown and convert to string
      const renderedHtml = ReactDOMServer.renderToStaticMarkup(
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      );

      // Create a temporary DOM element to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderedHtml;

      // Use ProseMirror's DOMParser to parse the HTML into a document fragment
      const domParser = DOMParser.fromSchema(view.state.schema);
      const slice = domParser.parseSlice(tempDiv);

      // Insert the content at the current selection
      const transaction = view.state.tr.replaceSelection(slice);
      view.dispatch(transaction);
    } catch (error) {
      console.error('Error processing markdown paste:', error);
      // Fallback to plain text if parsing fails
      const transaction = view.state.tr.insertText(markdown);
      view.dispatch(transaction);
    }
  };

  processMarkdown(text);
};

export const MarkdownPaste = Extension.create<MarkdownPasteOptions>({
  name: 'markdownPaste',

  addOptions() {
    return {
      enabled: true,
    };
  },

  addCommands() {
    return {
      setMarkdownPasteEnabled:
        (enabled: boolean) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta('markdownPasteEnabled', enabled);
          }
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: new PluginKey('markdownPaste'),
        props: {
          handlePaste: (view, event) => {
            if (!extension.options.enabled) {
              return false;
            }

            const clipboardData = event.clipboardData;
            if (!clipboardData) {
              return false;
            }

            const text = clipboardData.getData('text/plain');
            if (!text || text.trim().length === 0) {
              return false;
            }

            // Check if this looks like markdown content
            if (!isMarkdownContent(text)) {
              return false;
            }

            // Prevent default paste behavior
            event.preventDefault();

            // Convert markdown to editor commands
            handleMarkdownPaste(text, view);
            return true;
          },
        },
      }),
    ];
  },

  addStorage() {
    return {
      enabled: this.options.enabled,
    };
  },
});

export default MarkdownPaste;
