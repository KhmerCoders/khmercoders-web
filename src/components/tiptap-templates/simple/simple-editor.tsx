'use client';

import * as React from 'react';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Selection } from '@tiptap/extensions';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Plugin, PluginKey } from 'prosemirror-state';

// --- Lowlight ---
import { lowlight } from 'lowlight/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';

// --- UI Primitives ---
import { Button } from '@/components/tiptap-ui-primitive/button';
import { Spacer } from '@/components/tiptap-ui-primitive/spacer';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar';

// --- Tiptap Node ---
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension';
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension';
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss';
import '@/components/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss';
import '@/components/tiptap-node/list-node/list-node.scss';

// --- Custom Extensions ---
import { MarkdownPaste } from './extensions/markdown-paste';
import '@/components/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-node/heading-node/heading-node.scss';
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';

// Custom plugin to handle code block paste events
const codeBlockPastePlugin = new Plugin({
  key: new PluginKey('codeBlockPaste'),
  props: {
    handlePaste(view, event, slice) {
      const { state } = view;
      const { selection } = state;

      // Check if we're in a code block
      const isInCodeBlock =
        state.schema.nodes.codeBlock &&
        selection.$from.parent.type === state.schema.nodes.codeBlock;

      if (isInCodeBlock) {
        // Get the pasted text
        const text = event.clipboardData?.getData('text/plain');
        if (text) {
          // Insert the text directly without processing
          const tr = state.tr.insertText(text, selection.from, selection.to);
          view.dispatch(tr);
          return true; // Prevent default paste behavior
        }
      }

      return false; // Allow default paste behavior for other content
    },
  },
});

// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu';
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button';
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu';
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button';
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button';
import { FloatingCodeBlockSelector } from '@/components/tiptap-ui/floating-code-block-selector';
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from '@/components/tiptap-ui/color-highlight-popover';
import { LinkPopover, LinkContent, LinkButton } from '@/components/tiptap-ui/link-popover';
import { MarkButton } from '@/components/tiptap-ui/mark-button';
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button';

// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon';
import { LinkIcon } from '@/components/tiptap-icons/link-icon';

// --- Hooks ---
import { useIsMobile } from '@/hooks/use-mobile';
import { useWindowSize } from '@/hooks/use-window-size';
import { useCursorVisibility } from '@/hooks/use-cursor-visibility';

// --- Components ---
import { ThemeToggle } from '@/components/tiptap-templates/simple/theme-toggle';

// --- Lib ---
import { MAX_FILE_SIZE } from '@/libs/tiptap-utils';
import { useUserUpload } from '@/components/user-upload/context';

// --- Styles ---
import '@/components/tiptap-templates/simple/simple-editor.scss';
import '@/components/tiptap-templates/simple/code-block-highlight.scss';

import content from '@/components/tiptap-templates/simple/data/content.json';
// Register languages for syntax highlighting
lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('typescript', typescript);
lowlight.registerLanguage('python', python);
lowlight.registerLanguage('json', json);
lowlight.registerLanguage('xml', xml);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('bash', bash);
lowlight.registerLanguage('markdown', markdown);

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  editor,
  openUserUpload,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  editor: any;
  openUserUpload: (mode: 'file' | 'upload') => Promise<string | null>;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} portal={isMobile} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton
          text="Add"
          onClick={async () => {
            if (!editor) return;
            const url = await openUserUpload('upload');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'highlighter' | 'link';
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
);

export interface SimpleEditorProps {
  content: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

export function SimpleEditor(props: SimpleEditorProps) {
  const { content, onChange, readOnly = false } = props;
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<'main' | 'highlighter' | 'link'>('main');
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const { openUserUpload } = useUserUpload();

  // Custom upload function using openUserUpload
  const uploadWithUserUpload = React.useCallback(
    async (_file: File) => {
      // Optionally, you can add file size validation here if needed
      const url = await openUserUpload('upload');
      if (!url) throw new Error('No image selected');
      return url;
    },
    [openUserUpload]
  );
  // Ref to always have the latest onChange
  const onChangeRef = React.useRef<((content: string) => void) | undefined>(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false, // Disable default code block to use CodeBlockLowlight
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
        exitOnTripleEnter: false,
        exitOnArrowDown: false,
        HTMLAttributes: {
          spellcheck: 'false',
        },
      }),
      MarkdownPaste.configure({
        enabled: true,
      }),
      // Add custom paste plugin
      Extension.create({
        name: 'codeBlockPaste',
        addProseMirrorPlugins() {
          return [codeBlockPastePlugin];
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: uploadWithUserUpload,
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      if (typeof onChangeRef.current === 'function') {
        onChangeRef.current(editor.getHTML());
      }
    },
  });

  // Keep editor content in sync with prop
  React.useEffect(() => {
    if (editor && typeof content === 'string' && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor]);

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main');
    }
  }, [isMobile, mobileView]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        ref={toolbarRef}
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
              }
            : {}
        }
      >
        {mobileView === 'main' ? (
          <MainToolbarContent
            onHighlighterClick={() => setMobileView('highlighter')}
            onLinkClick={() => setMobileView('link')}
            isMobile={isMobile}
            editor={editor}
            openUserUpload={openUserUpload}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
            onBack={() => setMobileView('main')}
          />
        )}
      </Toolbar>

      <div className="content-wrapper">
        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
      </div>

      {/* Floating language selector for code blocks */}
      <FloatingCodeBlockSelector editor={editor} />
    </EditorContext.Provider>
  );
}
