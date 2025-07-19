'use client';

import * as React from 'react';
import { type Editor } from '@tiptap/react';
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

interface CodeBlockLanguageSelectorProps {
  editor: Editor;
  className?: string;
}

export function CodeBlockLanguageSelector({ editor, className }: CodeBlockLanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState('javascript');

  React.useEffect(() => {
    if (!editor) return;

    const updateLanguage = () => {
      if (editor.isActive('codeBlock')) {
        const attrs = editor.getAttributes('codeBlock');
        setCurrentLanguage(attrs.language || 'javascript');
      }
    };

    updateLanguage();
    editor.on('selectionUpdate', updateLanguage);
    editor.on('transaction', updateLanguage);

    return () => {
      editor.off('selectionUpdate', updateLanguage);
      editor.off('transaction', updateLanguage);
    };
  }, [editor]);

  const handleLanguageChange = (language: string) => {
    if (editor.isActive('codeBlock')) {
      editor.chain().focus().updateAttributes('codeBlock', { language }).run();
      setCurrentLanguage(language);
    }
    setIsOpen(false);
  };

  if (!editor.isActive('codeBlock')) {
    return null;
  }

  const currentLang =
    SUPPORTED_LANGUAGES.find(lang => lang.value === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
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
            <div className="py-1">
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
  );
}
