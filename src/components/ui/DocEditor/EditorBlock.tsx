// src/components/ui/DocEditor/EditorBlock.tsx
import './DocEditor.css'; // Importe o CSS que criamos
import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';

// ... (Mantenha os tipos Block, BlockType e Interfaces iguais) ...
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
}

// ... (Mantenha a função setCaretToEnd igual) ...
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

     // 1. Sincronização Inicial / Externa
     useEffect(() => {
          if (contentRef.current && contentRef.current.innerText !== block.content) {
               contentRef.current.innerText = block.content;
          }
     }, [block.content, block.id, block.type]);
     // Nota: block.content removido das dependências para evitar bug do cursor

     // 2. Gerenciamento de Foco
     useLayoutEffect(() => {
          if (focusId === block.id && contentRef.current) {
               contentRef.current.focus();
          }
          if (justTransformed && contentRef.current) {
               setCaretToEnd(contentRef.current);
               setJustTransformed(false);
          }
     }, [focusId, block.id, block.type, justTransformed]);

     // 3. Handlers (Input e KeyDown)
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
               addBlock(block.id);
          }

          if (e.key === 'Backspace') {
               // Pegamos a posição do cursor
               const selection = window.getSelection();
               // anchorOffset 0 significa que o cursor está no começo do texto
               const isAtStart = selection?.anchorOffset === 0 && selection.isCollapsed;

               // CENÁRIO 1: Reverter formatação (H2 -> Parágrafo)
               // Se estou no início e NÃO sou um parágrafo, viro parágrafo
               if (isAtStart && block.type !== 'paragraph') {
                    e.preventDefault();
                    transformBlock(block.id, 'paragraph');
                    return;
               }

               // CENÁRIO 2: Deletar bloco vazio
               // Se sou parágrafo vazio (ou qualquer bloco vazio que passou do check acima)
               if (block.content === '') {
                    e.preventDefault();
                    removeBlock(block.id);
               }
          }
     };

     // --- RENDERIZAÇÃO COM CSS PURO ---

     // Caso Heading (H2, H3)
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

     // Caso Lista (Item com bolinha)
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

     // Caso Padrão (Parágrafo)
     return (
          <div className="editor-block-wrapper">
               <div
                    ref={contentRef as React.RefObject<HTMLDivElement>}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    className="editor-input editor-paragraph"
                    data-placeholder="Digite '/' para comandos..."
               />
          </div>
     );
};