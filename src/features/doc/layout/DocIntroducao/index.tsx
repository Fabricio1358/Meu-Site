// src\features\doc\layout\DocIntroducao\index.tsx
import { useLocation } from 'react-router-dom';
import './doc.css'

// Layout
import DocLayout from '@/features/doc/layout/DocContentLayout';

const DocIntroducao = () => {
     const { pathname } = useLocation();
     const generateDocId = (pathname: string): string => {
          // Remove a primeira barra e substitui as demais por hífen
          // Ex: /docs/documento/futuro -> docs-documento-futuro
          return pathname.replace(/^\//, '').replace(/\//g, '-');
     };

     // Render
     const documentId = generateDocId(pathname);

     return (
          <DocLayout documentId={documentId} collectionName='DocContent' />
     )
}

export default DocIntroducao;