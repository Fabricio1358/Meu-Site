/* eslint-disable @typescript-eslint/no-explicit-any */
// src\components\layout\DocLayout\index.tsx
import './DocLayout.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
     EditorBlock,
     type Block,
     type BlockType
} from '@/components/ui/DocEditor/EditorBlock';


const DocLayout = ({ date, title, description, initialBlocks = [] }: any) => {
     const [blocks, setBlocks] = useState<Block[]>(initialBlocks.length > 0 ? initialBlocks : [
          { id: uuidv4(), type: 'paragraph', content: '' }
     ]);

     const [focusId, setFocusId] = useState<string | null>(null);

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

     const headings = blocks.filter(b => b.type === 'heading');

     return (
          <main className='docLayout-main'>
               <div className='docLayout-content'>
                    <span className='docLayout-date'>{date}</span>
                    <h1>{title}</h1>
                    <p>{description}</p>

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