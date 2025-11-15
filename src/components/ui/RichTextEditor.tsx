import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Heading1,
  Heading2,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  showVariables?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  height = '300px',
  showVariables = true,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertVariable = (variable: string) => {
    execCommand('insertHTML', `<span class="variable" contenteditable="false" style="background-color: #EBF5FF; color: #1E40AF; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.875rem;">{{${variable}}}</span>&nbsp;`);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: Heading1, command: 'formatBlock', value: '<h1>', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: '<h2>', title: 'Heading 2' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: Code, command: 'formatBlock', value: '<pre>', title: 'Code Block' },
  ];

  const variables = [
    'contact_name',
    'first_name',
    'last_name',
    'email',
    'company',
    'phone',
    'deal_name',
    'deal_amount',
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap items-center gap-1">
        {/* Formatting buttons */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          {toolbarButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => execCommand(button.command, button.value)}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title={button.title}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Link button */}
        <button
          type="button"
          onClick={insertLink}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>

        {/* Variables dropdown */}
        {showVariables && (
          <div className="relative ml-2 border-l border-gray-300 pl-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  insertVariable(e.target.value);
                  e.target.value = '';
                }
              }}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Insert Variable</option>
              {variables.map((variable) => (
                <option key={variable} value={variable}>
                  {'{{'}{variable}{'}}'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Text/HTML toggle */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Rich Text Editor
          </span>
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`p-4 outline-none overflow-y-auto prose prose-sm max-w-none ${
          isFocused ? 'ring-2 ring-primary-200' : ''
        }`}
        style={{
          minHeight: height,
          maxHeight: height,
        }}
        suppressContentEditableWarning
      >
        {!value && (
          <p className="text-gray-400 pointer-events-none">{placeholder}</p>
        )}
      </div>

      {/* Footer with character count */}
      <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Tip: Use variables to personalize your emails
        </div>
        <div className="text-xs text-gray-500">
          {editorRef.current?.innerText?.length || 0} characters
        </div>
      </div>

      {/* Custom CSS for editor content */}
      <style>{`
        [contenteditable] {
          caret-color: #1F2937;
        }
        [contenteditable]:focus {
          outline: none;
        }
        [contenteditable] h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        [contenteditable] p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        [contenteditable] li {
          margin-bottom: 0.25rem;
        }
        [contenteditable] a {
          color: #2563EB;
          text-decoration: underline;
        }
        [contenteditable] pre {
          background-color: #F3F4F6;
          padding: 0.75rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.875rem;
        }
        [contenteditable] .variable {
          user-select: none;
          cursor: default;
        }
      `}</style>
    </div>
  );
};
