'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight/lib/core';
import { Highlight } from '@tiptap/extension-highlight';
import { TaskList, TaskItem } from '@tiptap/extension-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Image } from '@tiptap/extension-image';
import { Typography } from '@tiptap/extension-typography';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';

// Import syntax highlighting languages
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';

import './TipTapContent.scss';
import '@/components/tiptap-templates/simple/code-block-highlight.scss';

// Register languages for syntax highlighting
lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('typescript', typescript);
lowlight.registerLanguage('python', python);
lowlight.registerLanguage('json', json);
lowlight.registerLanguage('xml', xml);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('bash', bash);
lowlight.registerLanguage('markdown', markdown);

interface TipTapContentProps {
  children: string;
  className?: string;
}

export function TipTapContent({ children, className = '' }: TipTapContentProps) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use CodeBlockLowlight
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      Typography,
      Superscript,
      Subscript,
    ],
    content: children,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && children) {
      editor.commands.setContent(children);
    }
  }, [editor, children]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`tiptap-content ${className}`}>
      <EditorContent editor={editor} />
    </div>
  );
}
