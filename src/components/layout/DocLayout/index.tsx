/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/layout/DocLayout/index.tsx
import './DocLayout.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Instale: npm i uuid @types/uuid

// Types & Ui
import {
     EditorBlock,
     type Block,
     type BlockType
} from '@/components/ui/DocEditor/EditorBlock';


// Função auxiliar para gerar IDs amigáveis para URL baseados no conteúdo do título

const DocLayout = ({ date, title, description, initialBlocks = [] }: any) => {
     // --- ESTADOS ---
     const [blocks, setBlocks] = useState<Block[]>(initialBlocks.length > 0 ? initialBlocks : [
          { id: uuidv4(), type: 'paragraph', content: '' }
     ]);

     // Este estado controla quem deve receber o foco (O Caret)
     const [focusId, setFocusId] = useState<string | null>(null);

     // --- AÇÕES DO EDITOR ---
     const updateBlock = (id: string, content: string) => {
          setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
     };

     const transformBlock = (id: string, newType: BlockType, newLevel?: 2 | 3) => {
          setBlocks(prev => prev.map(b => b.id === id ? { ...b, type: newType, level: newLevel } : b));
     };

     // CORREÇÃO DO ENTER: Adiciona bloco e FORÇA o foco nele
     const addBlock = (currentId: string) => {
          const newId = uuidv4();
          const newBlock: Block = { id: newId, type: 'paragraph', content: '' };

          const currentIndex = blocks.findIndex(b => b.id === currentId);
          const newBlocks = [...blocks];

          // Insere o novo bloco logo após o atual
          newBlocks.splice(currentIndex + 1, 0, newBlock);

          setBlocks(newBlocks);
          setFocusId(newId); // <--- ISSO faz o Caret descer!
     };

     const removeBlock = (id: string) => {
          if (blocks.length <= 1) return;

          const index = blocks.findIndex(b => b.id === id);
          const prevBlock = blocks[index - 1]; // Pega o bloco de cima

          setBlocks(prev => prev.filter(b => b.id !== id));

          if (prevBlock) {
               setFocusId(prevBlock.id); // <--- Volta o foco para cima ao deletar
          }
     };

     // NOVA FUNÇÃO: Clicar no espaço vazio cria bloco no final
     const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
          // Verifica se o clique foi diretamente na div canvas e não em um texto
          if (e.target === e.currentTarget) {
               const lastBlock = blocks[blocks.length - 1];

               // Se o último bloco já estiver vazio, foca nele (não cria outro)
               if (lastBlock && lastBlock.content.trim() === '') {
                    setFocusId(lastBlock.id);
                    // Pequeno hack para garantir que o useEffect do filho dispare se o ID for o mesmo
                    // setFocusId(null); setTimeout(() => setFocusId(lastBlock.id), 0); 
                    return;
               }

               // Se o último tiver texto, cria um novo no final
               const newId = uuidv4();
               const newBlock: Block = { id: newId, type: 'paragraph', content: '' };
               setBlocks(prev => [...prev, newBlock]);
               setFocusId(newId);
          }
     };

     // No render:
     {
          blocks.map((block) => (
               <EditorBlock
                    key={block.id}
                    block={block}
                    focusId={focusId} // Passando o focusId
                    updateBlock={updateBlock}
                    transformBlock={transformBlock}
                    addBlock={addBlock}
                    removeBlock={removeBlock}
               />
          ))
     }

     // --- Lógica de ScrollSpy (TOC) ---
     // (Mantenha sua lógica de ScrollSpy aqui, filtrando apenas blocks.type === 'heading')
     const headings = blocks.filter(b => b.type === 'heading');

     return (
          <main className='docLayout-main'>
               <div className='docLayout-content'>
                    <span className='docLayout-date'>{date}</span>
                    <h1>{title}</h1>
                    <p>{description}</p>

                    {/* ADICIONADO O ONCLICK AQUI NA DIV WRAPPER */}
                    <div
                         className="editor-canvas"
                         onClick={handleCanvasClick}
                         style={{ minHeight: '300px', cursor: 'text', paddingBottom: '100px' }}
                    >
                         {blocks.map((block) => (
                              <EditorBlock
                                   key={block.id}
                                   block={block}
                                   focusId={focusId} // Passando o ID do foco
                                   updateBlock={updateBlock}
                                   transformBlock={transformBlock}
                                   addBlock={addBlock}
                                   removeBlock={removeBlock}
                              />
                         ))}
                    </div>
               </div>

               {/* Menu Lateral (Table of Contents) */}
               <div className='docLayout-topics'>
                    <h5>CONTENTS</h5>
                    {headings.map(h => (
                         <div key={h.id} className="docLayout-topics-item">
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