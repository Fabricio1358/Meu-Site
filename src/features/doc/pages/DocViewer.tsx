import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import DocLayout from '@/components/layout/DocLayout';
import { useFirestore } from '@/hooks/useFirestore';
import { firestoreService } from '@/services/firestoreService';
import { queryHelpers } from '@/services/firestoreService';

// Tipagem padronizada
interface LinkType {
     label: string;
     to: string;
     createdAt?: number;
}

interface SecaoFirestore {
     id?: string;
     title: string;
     links: LinkType[];
     createdAt: number;
}

// Função centralizada para gerar IDs consistentes
const generateDocId = (pathname: string): string => {
     // Remove a primeira barra e substitui as demais por hífen
     // Ex: /docs/documento/futuro -> docs-documento-futuro
     return pathname.replace(/^\//, '').replace(/\//g, '-');
};

const DocViewer = () => {
     const { pathname } = useLocation();
     const [initializing, setInitializing] = useState(false);
     const [notFound, setNotFound] = useState(false);

     // Busca todas as seções ordenadas
     const { data: sections, loading } = useFirestore<SecaoFirestore>(
          'DocSecoes',
          [queryHelpers.orderByDesc('createdAt')]
     );

     // --- BUSCA O TÓPICO CORRESPONDENTE ---
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

     // --- INICIALIZA DOCUMENTO NO FIREBASE ---
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
                         console.log(`Criando documento: ${documentId}`);

                         await firestoreService.createWithId('DocContent', documentId, {
                              // Metadados do documento
                              title: foundTopic.label,
                              description: `Documentação sobre ${foundTopic.label}`,
                              date: new Date().toLocaleDateString('pt-BR'),

                              // Bloco inicial vazio
                              blocks: [{
                                   id: crypto.randomUUID(),
                                   type: 'paragraph',
                                   content: ''
                              }],

                              // Referências de organização
                              pathname: pathname,
                              section: sectionTitle,

                              // Timestamps
                              createdAt: Date.now(),
                              updatedAt: Date.now()
                         });

                         console.log(`✅ Documento criado: ${documentId}`);
                    } else {
                         console.log(`✅ Documento já existe: ${documentId}`);
                    }

               } catch (error) {
                    console.error('❌ Erro ao inicializar documento:', error);
                    setNotFound(true);
               } finally {
                    setInitializing(false);
               }
          };

          initializeDocument();
     }, [pathname, foundTopic, loading, sectionTitle]);

     // --- LOADING ---
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

     // --- 404 ---
     if (!foundTopic || notFound) {
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

     // --- RENDERIZAÇÃO ---
     const documentId = generateDocId(pathname);

     return (
          <DocLayout
               documentId={documentId}
               collectionName="DocContent"
          />
     );
};

export default DocViewer;