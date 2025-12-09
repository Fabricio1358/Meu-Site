// src\features\doc\pages\index.tsx
import { useLocation } from 'react-router-dom';
import './doc.css'

// Layout
import DocLayout from '@/components/layout/DocLayout';


const DocIntroducao = () => {
     const { pathname } = useLocation();
     // Função centralizada para gerar IDs consistentes
     const generateDocId = (pathname: string): string => {
          // Remove a primeira barra e substitui as demais por hífen
          // Ex: /docs/documento/futuro -> docs-documento-futuro
          return pathname.replace(/^\//, '').replace(/\//g, '-');
     };

     // --- RENDERIZAÇÃO ---
     const documentId = generateDocId(pathname);

     return (
          <DocLayout documentId={documentId} collectionName='DocContent'/>
     )
}

export default DocIntroducao;