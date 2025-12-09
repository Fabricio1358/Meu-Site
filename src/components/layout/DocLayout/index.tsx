/* eslint-disable react-hooks/exhaustive-deps */
// src/components/layout/DocLayout/index.tsx
import './DocLayout.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDocument } from '@/hooks/useFirestore';
import { firestoreService } from '@/services/firestoreService';

import {
     EditorBlock,
     type Block,
     type BlockType
} from '@/components/ui/DocEditor/EditorBlock';

interface DocLayoutProps {
     documentId: string;
     collectionName?: string;
}

interface DocumentData {
     id?: string;
     date: string;
     title: string;
     description: string;
     blocks: Block[];
     updatedAt: number;
}

const DocLayout = ({ documentId, collectionName = 'DocContent' }: DocLayoutProps) => {
     // Busca documento do Firebase
     const { document, loading, error } = useDocument<DocumentData>(collectionName, documentId);

     // Estado local dos blocos
     const [blocks, setBlocks] = useState<Block[]>([
          { id: uuidv4(), type: 'paragraph', content: '' }
     ]);
     const [focusId, setFocusId] = useState<string | null>(null);
     const [saving, setSaving] = useState(false);
     const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
          // Só salva se realmente mudou
          if (JSON.stringify(lastSavedRef.current) === JSON.stringify(blocksToSave)) {
               console.log("⏩ Nenhuma mudança, não salvou.");
               return;
          }

          // Atualiza referência do que já foi salvo
          lastSavedRef.current = blocksToSave;

          try {
               setSaving(true);

               await firestoreService.update(collectionName, documentId, {
                    blocks: blocksToSave,
                    updatedAt: Date.now()
               });

               setLastSaved(new Date());
               console.log("✅ Salvo!");
          } catch (err) {
               console.error("❌ Erro ao salvar:", err);
          } finally {
               setSaving(false);
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
          return (
               <main className='docLayout-main'>
                    <div className='docLayout-content'>
                         <div style={{ padding: '2rem', color: '#e74c3c' }}>
                              Erro ao carregar documento: {error}
                         </div>
                    </div>
               </main>
          );
     }

     const headings = blocks.filter(b => b.type === 'heading');

     return (
          <main className='docLayout-main'>
               {/* Indicador de salvamento */}
               {saving && (
                    <div style={{
                         position: 'fixed',
                         bottom: '30px',
                         right: '20px',
                         background: '#3498db',
                         color: 'white',
                         padding: '8px 16px',
                         borderRadius: '4px',
                         fontSize: '14px',
                         zIndex: 1000,
                         boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                         💾 Salvando...
                    </div>
               )}

               {/* Indicador de último salvamento */}
               {!saving && lastSaved && (
                    <div style={{
                         position: 'fixed',
                         bottom: '30px',
                         right: '20px',
                         background: '#27ae60',
                         color: 'white',
                         padding: '8px 16px',
                         borderRadius: '4px',
                         fontSize: '14px',
                         zIndex: 1000,
                         boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                         ✓ Salvo {lastSaved.toLocaleTimeString('pt-BR')}
                    </div>
               )}

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