// src\features\doc\layout\DocSidebarLayout\index.tsx
import './SidebarLayout.css';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// UI
import Group from "@/features/doc/ui/DocGroup";
import DocButton from "@/features/doc/ui/DocButton";

// Firestore
import { useFirestore } from '@/hooks/useFirestore';
import { firestoreService, queryHelpers } from '@/services/firestoreService';

// Components
import { useConsoleBar } from '@/components/ConsoleBar/ConsoleBarContext';

// Types
import type { LinkType, SecaoFirestore, SidebarLayoutProps } from '../../types/DocLayoutTypes';

const SidebarLayout = ({ variant }: SidebarLayoutProps) => {
     const { openBar } = useConsoleBar();
     const navigate = useNavigate();
     useLocation();
     const inputRef = useRef<HTMLInputElement>(null);

     const { data: sections, createComId, update, loading } = useFirestore<SecaoFirestore>(
          'DocSecoes',
          [queryHelpers.orderByAsc('createdAt')]
     );

     const [tempNewSection, setTempNewSection] = useState(false);
     const [addingTopicTo, setAddingTopicTo] = useState<string | null>(null);

     useEffect(() => {
          if ((tempNewSection || addingTopicTo) && inputRef.current) {
               inputRef.current.focus();
          }
     }, [tempNewSection, addingTopicTo]);

     // Slug
     const createSlug = (text: string): string => {
          return text
               .toLowerCase()
               .normalize('NFD')
               .replace(/[\u0300-\u036f]/g, "") // Remove acentos
               .replace(/\s+/g, '-') // Espaços viram hífen
               .replace(/[^\w-]/g, ''); // Remove caracteres especiais
     };

     const handleAddSection = () => {
          setTempNewSection(true);
          setAddingTopicTo(null);
     };

     const handleSaveNewSection = async (title: string) => {
          if (!title.trim()) {
               setTempNewSection(false);
               return;
          }

          // cria slug a partir do título da seção
          const sectionSlug = createSlug(title.trim());
          const sectionId = `doc-${sectionSlug}`;

          try {
               // Verifica se já existe uma seção com esse ID na coleção DocSecoes
               const existingSection = await firestoreService.get('DocSecoes', sectionId);

               if (existingSection) {
                    alert('Já existe uma seção com esse nome.');
                    setTempNewSection(false);
                    return;
               }

               await createComId(
                    {
                         title: title.trim(),
                         links: [],
                         createdAt: Date.now()
                    },
                    sectionId
               );

               setTempNewSection(false);
          } catch (error) {
               openBar({
                    info: "Erro ao criar seção:",
                    error: error,
                    code: 404,
                    backgroundColor: "red",
                    type: "Error"
               })
          }
     };

     const handleAddTopicClick = (sectionId: string) => {
          setAddingTopicTo(sectionId);
          setTempNewSection(false);
     };

     const handleSaveNewTopic = async (topicName: string, section: SecaoFirestore) => {
          if (!topicName.trim() || !section.id) {
               setAddingTopicTo(null);
               return;
          }

          try {
               // Cria slugs padronizados
               const sectionSlug = createSlug(section.title);
               const topicSlug = createSlug(topicName);

               // Path padronizado: /docs/secao-slug/topico-slug
               const newPath = `/docs/${sectionSlug}/${topicSlug}`;

               // Verifica se já existe um link com esse path
               const existingLink = section.links?.find(link => link.to === newPath);
               if (existingLink) {
                    alert(`Já existe um tópico com este nome nesta seção.`);
                    setAddingTopicTo(null);
                    return;
               }

               // Cria novo link
               const newLink: LinkType = {
                    label: topicName.trim(),
                    to: newPath,
                    createdAt: Date.now()
               };

               // Atualiza array de links
               const currentLinks = section.links || [];
               const updatedLinks = [...currentLinks, newLink];

               // Salva no Firestore
               await update(section.id, {
                    links: updatedLinks
               });

               // Limpa estado e navega
               setAddingTopicTo(null);
               navigate(newPath);

          } catch (error) {
               openBar({
                    info: "rro ao adicionar tópico:",
                    error: error,
                    code: 404,
                    backgroundColor: "red",
                    type: "Error"
               })
          }
     };

     // Handles de Teclado
     const handleKeyDown = (
          e: React.KeyboardEvent,
          text: string,
          type: 'newSection' | 'newTopic',
          sectionData?: SecaoFirestore
     ) => {
          if (e.key === 'Enter') {
               e.preventDefault();
               if (type === 'newSection') {
                    handleSaveNewSection(text);
               } else if (type === 'newTopic' && sectionData) {
                    handleSaveNewTopic(text, sectionData);
               }
          } else if (e.key === 'Escape') {
               setTempNewSection(false);
               setAddingTopicTo(null);
          }
     };

     return (
          <main className='mainSidebar-main'>
               {variant === "docs" && (
                    <div className='mainSidebar-links'>
                         <Link to="/docs/introducao" className='introducao'>
                              <h4>Introdução</h4>
                         </Link>

                         {/* Nova Seção */}
                         {tempNewSection && (
                              <Group
                                   title={
                                        <input
                                             ref={inputRef}
                                             className="sidebar-input"
                                             placeholder="Nome da nova seção..."
                                             onBlur={(e) => handleSaveNewSection(e.target.value)}
                                             onKeyDown={(e) => handleKeyDown(e, e.currentTarget.value, 'newSection')}
                                        />
                                   }
                                   children={undefined}
                              />
                         )}

                         {/* Listagem das Seções */}
                         {loading ? (
                              <p style={{ padding: '12px', color: '#666' }}>
                                   Carregando seções...
                              </p>
                         ) : (
                              sections.map((group) => (
                                   <Group key={group.id} title={group.title}>
                                        {/* Links Existentes */}
                                        {(group.links || []).map((link, i) => (
                                             <div key={i}>
                                                  <Link to={link.to}>{link.label}</Link>
                                             </div>
                                        ))}

                                        {/* Novo Tópico */}
                                        <div style={{ marginTop: '8px' }}>
                                             {addingTopicTo === group.id ? (
                                                  <input
                                                       ref={inputRef}
                                                       className="sidebar-input-topic"
                                                       placeholder="Nome do tópico..."
                                                       style={{
                                                            width: '100%',
                                                            padding: '6px 8px',
                                                            borderRadius: '4px',
                                                            border: '1px solid #ddd'
                                                       }}
                                                       onBlur={(e) => handleSaveNewTopic(e.target.value, group)}
                                                       onKeyDown={(e) => handleKeyDown(e, e.currentTarget.value, 'newTopic', group)}
                                                  />
                                             ) : (
                                                  <DocButton
                                                       action={(e) => {
                                                            e.stopPropagation();
                                                            if (group.id) handleAddTopicClick(group.id);
                                                       }}
                                                       style='outline'
                                                       text='+ Tópico'
                                                       width='100%'
                                                       height='28px'
                                                       borderRadius='8px'
                                                       border='1px solid white'
                                                  />
                                             )}
                                        </div>
                                   </Group>
                              ))
                         )}

                         {/* Botão Adicionar Seção */}
                         {!tempNewSection && (
                              <DocButton
                                   action={handleAddSection}
                                   style='outline'
                                   text='+ Adicionar Seção'
                                   width='100%'
                                   height='36px'
                                   borderRadius='8px'
                                   border='1px solid white'
                              />
                         )}
                    </div>
               )}
          </main>
     );
};

export default SidebarLayout;