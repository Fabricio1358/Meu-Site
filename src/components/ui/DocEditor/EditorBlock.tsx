import './DocEditor.css';
import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';

export type BlockType = 'paragraph' | 'heading' | 'list';

export interface Block {
     id: string;
     type: BlockType;
     content: string;
     level?: 2 | 3;
}

interface EditorBlockProps {
     block: Block;
     updateBlock: (id: string, content: string) => void;
     transformBlock: (id: string, newType: BlockType, newLevel?: 2 | 3) => void;
     addBlock: (currentId: string) => void;
     removeBlock: (id: string) => void;
     focusId: string | null;
     isLastBlock?: boolean;
}

const setCaretToEnd = (element: HTMLElement) => {
     const range = document.createRange();
     const selection = window.getSelection();
     range.selectNodeContents(element);
     range.collapse(false);
     selection?.removeAllRanges();
     selection?.addRange(range);
     element.focus();
};

export const EditorBlock = ({
     block,
     updateBlock,
     transformBlock,
     addBlock,
     removeBlock,
     focusId
}: EditorBlockProps) => {
     const contentRef = useRef<HTMLElement>(null);
     const [justTransformed, setJustTransformed] = useState(false);
     const [wasEnterPressed, setWasEnterPressed] = useState(false);

     const isEmpty = block.content === '' && !wasEnterPressed;

     useEffect(() => {
          if (contentRef.current && contentRef.current.innerText !== block.content) {
               contentRef.current.innerText = block.content;
          }
          // Reset wasEnterPressed quando o conteúdo mudar (usuário começou a digitar)
          if (block.content !== '') {
               setWasEnterPressed(false);
          }
     }, [block.content, block.id, block.type]);

     useLayoutEffect(() => {
          if (focusId === block.id && contentRef.current) {
               contentRef.current.focus();
          }
          if (justTransformed && contentRef.current) {
               setCaretToEnd(contentRef.current);
               setJustTransformed(false);
          }
     }, [focusId, block.id, block.type, justTransformed]);

     const handleInput = (e: React.FormEvent<HTMLElement>) => {
          const text = e.currentTarget.innerText;
          let newType: BlockType | null = null;
          let newLevel: 2 | 3 | undefined = undefined;
          let cleanText = text;

          if (block.type !== 'heading' && text.startsWith('#2')) {
               newType = 'heading'; newLevel = 2; cleanText = text.replace('#2', '');
          } else if (block.type !== 'heading' && text.startsWith('#3')) {
               newType = 'heading'; newLevel = 3; cleanText = text.replace('#3', '');
          } else if (block.type !== 'list' && (text.startsWith('*'))) {
               newType = 'list'; cleanText = text.replace('*', '');
          }

          if (newType) {
               updateBlock(block.id, cleanText);
               transformBlock(block.id, newType, newLevel);
               setJustTransformed(true);
          } else {
               updateBlock(block.id, text);
          }
     };

     const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault();
               setWasEnterPressed(true);
               addBlock(block.id);
          }
          if (e.key === 'Backspace') {
               const selection = window.getSelection();
               const isAtStart = selection?.anchorOffset === 0 && selection.isCollapsed;

               if (isAtStart && block.type !== 'paragraph') {
                    e.preventDefault();
                    transformBlock(block.id, 'paragraph');
                    return;
               }
               if (block.content === '') {
                    e.preventDefault();
                    removeBlock(block.id);
               }
          }
     };

     const handleWrapperClick = () => {
          if (contentRef.current) {
               contentRef.current.focus();
          }
     };

     const wrapperClass = `editor-block-wrapper ${block.type === 'paragraph' && isEmpty ? 'is-empty' : ''}`;

     if (block.type === 'heading') {
          const Tag = `h${block.level}` as React.ElementType;
          const headingClass = block.level === 2 ? 'editor-h2' : 'editor-h3';
          return (
               <div className="editor-block-wrapper">
                    <Tag
                         ref={contentRef}
                         contentEditable
                         suppressContentEditableWarning
                         onInput={handleInput}
                         onKeyDown={handleKeyDown}
                         className={`editor-input ${headingClass}`}
                         id={block.id}
                    />
               </div>
          );
     }

     if (block.type === 'list') {
          return (
               <div className="editor-list-wrapper">
                    <span className="editor-list-bullet">•</span>
                    <div
                         ref={contentRef as React.RefObject<HTMLDivElement>}
                         contentEditable
                         suppressContentEditableWarning
                         onInput={handleInput}
                         onKeyDown={handleKeyDown}
                         className="editor-input editor-paragraph"
                    />
               </div>
          );
     }

     return (
          <div
               className={wrapperClass}
               onClick={handleWrapperClick}
          >
               <div
                    ref={contentRef as React.RefObject<HTMLDivElement>}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    className="editor-input editor-paragraph"
               />
          </div>
     );
};