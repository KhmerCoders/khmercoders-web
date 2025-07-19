'use client';

import * as React from 'react';
import { type Editor } from '@tiptap/react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML/HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'bash', label: 'Bash' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'text', label: 'Plain Text' },
];

interface FloatingCodeBlockSelectorProps {
  editor: Editor | null;
}

export function FloatingCodeBlockSelector({ editor }: FloatingCodeBlockSelectorProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [currentLanguage, setCurrentLanguage] = React.useState('javascript');
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!editor) return;

    const updateSelector = () => {
      const isCodeBlockActive = editor.isActive('codeBlock');

      if (isCodeBlockActive) {
        // Get the current language
        const attrs = editor.getAttributes('codeBlock');
        setCurrentLanguage(attrs.language || 'javascript');

        // Get the selection position
        const { view } = editor;
        const { from } = view.state.selection;
        const start = view.coordsAtPos(from);

        setPosition({
          top: start.top - 40,
          left: start.left,
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };

    updateSelector();
    editor.on('selectionUpdate', updateSelector);
    editor.on('transaction', updateSelector);

    return () => {
      editor.off('selectionUpdate', updateSelector);
      editor.off('transaction', updateSelector);
    };
  }, [editor]);

  const handleLanguageChange = (language: string) => {
    if (editor && editor.isActive('codeBlock')) {
      editor.chain().focus().updateAttributes('codeBlock', { language }).run();
      setCurrentLanguage(language);
    }
    setIsOpen(false);
  };

  if (!isVisible || !editor) {
    return null;
  }

  const currentLang =
    SUPPORTED_LANGUAGES.find(lang => lang.value === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return createPortal(
    <div
      className="fixed z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gray-800 border border-gray-600 rounded shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currentLang.label}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute z-50 w-32 mt-1 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
              <div className="py-1 max-h-48 overflow-y-auto">
                {SUPPORTED_LANGUAGES.map(language => (
                  <button
                    key={language.value}
                    onClick={() => handleLanguageChange(language.value)}
                    className={cn(
                      'block w-full px-3 py-1 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700',
                      currentLanguage === language.value &&
                        'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    )}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
