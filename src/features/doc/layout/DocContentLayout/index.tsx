/* eslint-disable react-hooks/exhaustive-deps */
// src\features\doc\layout\DocContentLayout\index.tsx
import './DocLayout.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Firestore
import { useDocument } from '@/hooks/useFirestore';
import { firestoreService } from '@/services/firestoreService';

// Ui


// Components
import { useConsoleBar } from '@/components/ConsoleBar/ConsoleBarContext';

// Types
import type { DocLayoutProps, DocumentData } from '../../types/DocLayoutTypes';
import type { Block, BlockType } from '../../types/DocUiTypes';
import { EditorBlock } from '../../ui/DocEditor/EditorBlock';



const DocLayout: React.FC<DocLayoutProps> = ({ documentId, collectionName = 'DocContent' }: DocLayoutProps) => {
     const { openBar } = useConsoleBar();
     // Busca documento do Firebase
     const { document, loading, error } = useDocument<DocumentData>(collectionName, documentId);

     // Estado local dos blocos
     const [blocks, setBlocks] = useState<Block[]>([
          { id: uuidv4(), type: 'paragraph', content: '' }
     ]);
     const [focusId, setFocusId] = useState<string | null>(null);

     // Ref para evitar loop infinito
     const isInitializedRef = useRef(false);
     const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

     // Sincroniza blocos do Firebase para o estado local (apenas uma vez ou quando muda)
     useEffect(() => {
          if (document?.blocks && document.blocks.length > 0) {
               setBlocks(document.blocks);
               isInitializedRef.current = true;
          }
     }, [document?.blocks]);

     const lastSavedRef = useRef<Block[] | null>(null);

     const saveToFirebase = useCallback(async (blocksToSave: Block[]) => {
          if (JSON.stringify(lastSavedRef.current) === JSON.stringify(blocksToSave)) {
               return;
          }

          // Atualiza referência do que já foi salvo
          lastSavedRef.current = blocksToSave;

          try {
               await firestoreService.update(collectionName, documentId, {
                    blocks: blocksToSave,
                    updatedAt: Date.now()
               });
          } catch (error) {
               openBar({
                    info: "Erro ao salvar dados no Firestore",
                    error: error,
                    backgroundColor: "red",
                    code: 404,
                    type: "Error"
               })
          }
     }, [collectionName, documentId]);

     useEffect(() => {
          if (!isInitializedRef.current) return;
          if (loading) return;
          if (blocks.length === 0) return;

          if (saveTimeoutRef.current) {
               clearTimeout(saveTimeoutRef.current);
          }

          saveTimeoutRef.current = setTimeout(() => {
               saveToFirebase(blocks);
          }, 1500);

          return () => clearTimeout(saveTimeoutRef.current!);
     }, [blocks]);

     const updateBlock = (id: string, content: string) => {
          setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
     };

     const transformBlock = (id: string, newType: BlockType, newLevel?: 2 | 3) => {
          setBlocks(prev => prev.map(b => b.id === id ? { ...b, type: newType, level: newLevel } : b));
     };

     const addBlock = (currentId: string) => {
          const newId = uuidv4();
          const newBlock: Block = { id: newId, type: 'paragraph', content: '' };

          const currentIndex = blocks.findIndex(b => b.id === currentId);
          const newBlocks = [...blocks];

          newBlocks.splice(currentIndex + 1, 0, newBlock);

          setBlocks(newBlocks);
          setFocusId(newId);
     };

     const removeBlock = (id: string) => {
          if (blocks.length <= 1) return;

          const index = blocks.findIndex(b => b.id === id);
          const prevBlock = blocks[index - 1];

          setBlocks(prev => prev.filter(b => b.id !== id));

          if (prevBlock) {
               setFocusId(prevBlock.id);
          }
     };

     const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) {
               const lastBlock = blocks[blocks.length - 1];

               if (lastBlock && lastBlock.content.trim() === '') {
                    setFocusId(lastBlock.id);
                    return;
               }

               const newId = uuidv4();
               const newBlock: Block = { id: newId, type: 'paragraph', content: '' };
               setBlocks(prev => [...prev, newBlock]);
               setFocusId(newId);
          }
     };

     // Loading state
     if (loading) {
          return (
               <main className='docLayout-main'>
                    <div className='docLayout-content'>
                         <div style={{ padding: '2rem', textAlign: 'center' }}>
                              Carregando documento...
                         </div>
                    </div>
               </main>
          );
     }

     // Error state
     if (error) {
          openBar({
               info: "Falha ao carregar conteúdo!",
               error: error,
               code: 404,
               backgroundColor: "red",
               type: "Success"
          });
          return (
               <main className='docLayout-main'>
                    <div className='docLayout-content'>
                         <div style={{ padding: '2rem', textAlign: 'center' }}>
                              Erro ao carregar documento
                         </div>
                    </div>
               </main>
          );
     }

     const headings = blocks.filter(b => b.type === 'heading');

     return (
          <main className='docLayout-main'>
               <div className='docLayout-content'>
                    <span className='docLayout-date'>{document?.date || new Date().toLocaleDateString('pt-BR')}</span>
                    <h1>{document?.title || 'Novo Documento'}</h1>
                    <p>{document?.description || 'Descrição do documento'}</p>

                    <div
                         className="editor-canvas"
                         onClick={handleCanvasClick}
                    >
                         {blocks.map((block, index) => (
                              <EditorBlock
                                   key={block.id}
                                   block={block}
                                   focusId={focusId}
                                   updateBlock={updateBlock}
                                   transformBlock={transformBlock}
                                   addBlock={addBlock}
                                   removeBlock={removeBlock}
                                   isLastBlock={index === blocks.length - 1}
                              />
                         ))}
                    </div>
               </div>

               <div className='docLayout-topics'>
                    <h5>CONTENTS</h5>
                    {headings.map(h => (
                         <div key={h.id} className={`docLayout-topics-item ${h.level === 3 ? 'is-h3' : ''}`}>
                              <a href={`#${h.id}`}>
                                   <h4>{h.content || '(Sem título)'}</h4>
                              </a>
                         </div>
                    ))}
               </div>
          </main>
     );
};

export default DocLayout;