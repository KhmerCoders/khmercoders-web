'use client';

import * as React from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { CodeBlockLanguageSelector } from '@/components/tiptap-ui/code-block-language-selector';
import { cn } from '@/utils';

interface CodeBlockNodeViewProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  editor: any;
  selected: boolean;
}

export function CodeBlockNodeView({
  node,
  updateAttributes,
  editor,
  selected,
}: CodeBlockNodeViewProps) {
  const language = node.attrs.language || 'javascript';

  return (
    <NodeViewWrapper className="relative">
      <div
        className={cn(
          'relative rounded-lg border bg-gray-50 dark:bg-gray-900',
          selected && 'ring-2 ring-blue-500'
        )}
      >
        {/* Language selector - appears when code block is focused */}
        <div className="absolute top-2 right-2 z-10">
          <CodeBlockLanguageSelector editor={editor} />
        </div>

        {/* Code content */}
        <pre className="overflow-x-auto p-4 text-sm">
          <NodeViewContent as="div" className={`language-${language}`} />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
