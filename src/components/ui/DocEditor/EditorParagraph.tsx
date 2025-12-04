// src\components\ui\DocEditor\EditorParagraph.tsx
import './DocEditor.css'
import React from 'react'

export interface ParagraphBlockProps {
     id: string;
     content: string;
}

export interface HeadingBlockProps {
     id: string;
     content: string;
     level: 1 | 2 | 3;
}

export interface ListBlockProps {
     id: string;
     items: string[];
}


export const EditorParagraph = ({ content }: ParagraphBlockProps) => {
     return (
          <section className='editor-containers paragraph-section'>
               <p>{content}</p>
          </section>
     );
};

export const EditorHeading = ({ content, level }: HeadingBlockProps) => {
     return (
          <section className='editor-containers paragraph-section'>
               {React.createElement(`h${level}`, null, content)}
          </section>
     );
};

export const EditorList = ({ items }: ListBlockProps) => {
     return (
          <section className='editor-containers paragraph-section'>
               <ul>
                    {items.map((item, i) => (
                         <li key={i}>{item}</li>
                    ))}
               </ul>
          </section>
     );
};