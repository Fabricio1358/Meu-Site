// src\features\doc\layout\DocViewer.tsx
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import DocLayout from '@/features/doc/layout/DocContentLayout';

// Hooks
import { useFirestore } from '@/hooks/useFirestore';

// Services
import { firestoreService } from '@/services/firestoreService';
import { queryHelpers } from '@/services/firestoreService';

// Components
import { useConsoleBar } from "@/components/ConsoleBar/ConsoleBarContext";

// Types
import type { LinkType, SecaoFirestore } from "../types/DocLayoutTypes";

// Função centralizada para gerar IDs
const generateDocId = (pathname: string): string => {
     // Ex: /docs/documento/futuro -> docs-documento-futuro
     return pathname.replace(/^\//, '').replace(/\//g, '-');
};

const DocViewer = () => {
     const { openBar } = useConsoleBar();
     const { pathname } = useLocation();
     const [initializing, setInitializing] = useState(false);
     const [notFound, setNotFound] = useState(false);

     // Busca todas as seções ordenadas
     const { data: sections, loading } = useFirestore<SecaoFirestore>(
          'DocSecoes',
          [queryHelpers.orderByDesc('createdAt')]
     );

     // Tópico correspondente
     let foundTopic: LinkType | null = null;
     let sectionTitle = '';

     for (const section of sections) {
          if (section.links && Array.isArray(section.links)) {
               const match = section.links.find(link => link.to === pathname);
               if (match) {
                    foundTopic = match;
                    sectionTitle = section.title;
                    break;
               }
          }
     }

     // Inicia documentos
     useEffect(() => {
          if (loading || !foundTopic) return;

          const initializeDocument = async () => {
               const documentId = generateDocId(pathname);

               try {
                    setInitializing(true);
                    setNotFound(false);

                    // Verifica se documento já existe
                    const existingDoc = await firestoreService.get('DocContent', documentId);

                    // Se não existe, cria com estrutura inicial
                    if (!existingDoc) {
                         await firestoreService.createWithId('DocContent', documentId, {
                              // Metadados do documento
                              title: foundTopic.label,
                              description: `Documentação sobre ${foundTopic.label}`,
                              date: new Date().toLocaleDateString('pt-BR'),
                              blocks: [{
                                   id: crypto.randomUUID(),
                                   type: 'paragraph',
                                   content: ''
                              }],
                              pathname: pathname,
                              section: sectionTitle,
                              createdAt: Date.now(),
                              updatedAt: Date.now()
                         });
                    }

               } catch (error) {
                    openBar({
                         info: "Erro ao inicializar documento:",
                         error: error,
                         code: 404,
                         backgroundColor: "red",
                         type: "Error"
                    })
               } finally {
                    setInitializing(false);
               }
          };

          initializeDocument();
     }, [pathname, foundTopic, loading, sectionTitle, openBar]);

     // Loading
     if (loading || initializing) {
          return (
               <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    fontSize: '16px',
                    color: '#666'
               }}>
                    {loading ? '🔍 Carregando estrutura...' : '📝 Preparando documento...'}
               </div>
          );
     }

     // 404
     if (!foundTopic || notFound) {
          openBar({
               info: "Tópico não encontrado!",
               code: 404,
               backgroundColor: "red",
               type: "Error"
          })
          return (
               <div style={{
                    padding: '40px',
                    maxWidth: '800px',
                    margin: '0 auto'
               }}>
                    <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>
                         404 - Tópico não encontrado
                    </h2>
                    <p style={{ marginBottom: '12px' }}>
                         O caminho <code style={{
                              background: '#f4f4f4',
                              padding: '2px 6px',
                              borderRadius: '3px'
                         }}>{pathname}</code> não existe na estrutura de documentação.
                    </p>
                    <p style={{ color: '#666', marginTop: '20px' }}>
                         Verifique se o link está correto ou volte para a página inicial.
                    </p>
               </div>
          );
     }

     // Render
     const documentId = generateDocId(pathname);

     return (
          <DocLayout
               documentId={documentId}
               collectionName="DocContent"
          />
     );
};

export default DocViewer;