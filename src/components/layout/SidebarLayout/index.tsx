import './SidebarLayout.css';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// UI e Types
import Group from "@/components/ui/Group";
import DocButton from "@/components/ui/DocButton";

// Firestore
import { useFirestore } from '@/hooks/useFirestore';
import { queryHelpers } from '@/services/firestoreService';

interface SidebarLayoutProps {
     variant: "docs" | "custom" | "none";
}

interface SecaoFirestore {
     id?: string;
     title: string;
     links: Array<{ label: string; to: string }>;
     createdAt: number;
}

const SidebarLayout = ({ variant }: SidebarLayoutProps) => {
     const navigate = useNavigate();
     const inputRef = useRef<HTMLInputElement>(null);

     // 1. Adicionamos o 'update' ao destructuring do hook
     const { data: sections, create, update, loading } = useFirestore<SecaoFirestore>(
          'DocSidebarSecoes',
          [queryHelpers.orderByDesc('createdAt')]
     );

     // Estado para controlar input de Nova Seção
     const [tempNewSection, setTempNewSection] = useState(false);

     // Estado para saber em QUAL seção estamos adicionando um tópico (guarda o ID da seção)
     const [addingTopicTo, setAddingTopicTo] = useState<string | null>(null);

     // Focar no input sempre que abrir um campo de edição
     useEffect(() => {
          if ((tempNewSection || addingTopicTo) && inputRef.current) {
               inputRef.current.focus();
          }
     }, [tempNewSection, addingTopicTo]);

     // --- UTILS ---
     // Função simples para criar slugs (Ex: "Minha Seção" -> "minha-secao")
     const createSlug = (text: string) => {
          return text
               .toLowerCase()
               .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
               .replace(/\s+/g, '-')
               .replace(/[^\w-]/g, '');
     };

     // --- AÇÕES DE SEÇÃO ---
     const handleAddSection = () => {
          setTempNewSection(true);
          setAddingTopicTo(null);
     };

     const handleSaveNewSection = async (title: string) => {
          if (!title.trim()) {
               setTempNewSection(false);
               return;
          }
          try {
               await create({
                    title: title,
                    links: [],
                    createdAt: Date.now()
               });
               setTempNewSection(false);
          } catch (error) {
               console.error("Erro ao criar seção:", error);
          }
     };

     // --- AÇÕES DE TÓPICO (NOVO) ---

     const handleAddTopicClick = (sectionId: string) => {
          setAddingTopicTo(sectionId);
          setTempNewSection(false); // Garante que fecha o outro input se estiver aberto
     };

     const handleSaveNewTopic = async (topicName: string, section: SecaoFirestore) => {
          // Se cancelou ou vazio
          if (!topicName.trim() || !section.id) {
               setAddingTopicTo(null);
               return;
          }

          try {
               // 1. Gera o path: /docs/nome-da-secao/nome-do-topico
               const sectionSlug = createSlug(section.title);
               const topicSlug = createSlug(topicName);
               const newPath = `/docs/${sectionSlug}/${topicSlug}`;

               // 2. Prepara o novo array de links
               const currentLinks = section.links || [];
               const newLinks = [...currentLinks, { label: topicName, to: newPath, createdAt: Date.now() }];

               // 3. Atualiza o documento no Firestore
               await update(section.id, { links: newLinks });

               // 4. Limpa estado e redireciona (opcional)
               setAddingTopicTo(null);
               navigate(newPath);

          } catch (error) {
               console.error("Erro ao adicionar tópico:", error);
               alert("Erro ao salvar tópico.");
          }
     };

     const handleKeyDown = (
          e: React.KeyboardEvent,
          text: string,
          type: 'newSection' | 'newTopic',
          sectionData?: SecaoFirestore
     ) => {
          if (e.key === 'Enter') {
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
                         <Link to="/docs" className='introducao'><h4>Introdução</h4></Link>

                         {/* Input de Nova Seção (Topo) */}
                         {tempNewSection && (
                              <Group title={<input
                                   ref={inputRef}
                                   className="sidebar-input"
                                   placeholder="Nome da nova seção..."
                                   onBlur={(e) => handleSaveNewSection(e.target.value)}
                                   onKeyDown={(e) => handleKeyDown(e, e.currentTarget.value, 'newSection')} />} children={undefined}>
                                   {/* Vazio */}
                              </Group>
                         )}

                         {/* Listagem das Seções */}
                         {loading ? <p>Carregando...</p> : sections.map((group) => (
                              <Group key={group.id} title={group.title}>

                                   {/* Links Existentes */}
                                   {(group.links || []).map((link, i) => (
                                        <div key={i}>
                                             <Link to={link.to}>{link.label}</Link>
                                        </div>
                                   ))}

                                   {/* Input de Novo Tópico OU Botão de Adicionar */}
                                   <div style={{ marginTop: '8px' }}>
                                        {addingTopicTo === group.id ? (
                                             <input
                                                  ref={inputRef}
                                                  className="sidebar-input-topic" // Use a classe CSS que você já tem para input de tópico
                                                  placeholder="Nome do tópico..."
                                                  style={{ width: '100%', padding: '5px' }} // Inline style só pra garantir caso falte CSS
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
                         ))}

                         {/* Botão para criar nova seção (Final da lista) */}
                         {!tempNewSection && (
                              <DocButton
                                   action={handleAddSection}
                                   style='outline'
                                   text='Adicionar Seção'
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