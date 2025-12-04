import './SidebarLayout.css';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// UI
import Group from "@/components/ui/Group";
import DocButton from "@/components/ui/DocButton";

// Types
import type GroupType from "@/types/GroupType";

// Dados iniciais (Mock) - Depois virá do Firebase
import initialGroupsData from "@/features/doc/data/groups";

interface SidebarLayoutProps {
     variant: "docs" | "custom" | "none";
}

type EditingState = {
     type: 'section' | 'topic';
     groupIndex: number;
     topicIndex?: number;
} | null;

const SidebarLayout = ({ variant }: SidebarLayoutProps) => {
     const navigate = useNavigate();
     const [localGroups, setLocalGroups] = useState<GroupType[]>(initialGroupsData);
     const [editing, setEditing] = useState<EditingState>(null);
     const inputRef = useRef<HTMLInputElement>(null);

     // Focar no input ao entrar em modo edição
     useEffect(() => {
          if (editing && inputRef.current) {
               inputRef.current.focus();
          }
     }, [editing]);

     // --- AÇÕES DO SIDEBAR ---

     const handleAddSection = () => {
          const newGroups = [...localGroups, { title: "", links: [] }];
          setLocalGroups(newGroups);
          setEditing({ type: 'section', groupIndex: newGroups.length - 1 });
     };

     const handleAddTopic = (groupIndex: number) => {
          const newGroups = [...localGroups];
          if (!newGroups[groupIndex].links) {
               newGroups[groupIndex].links = [];
          }
          newGroups[groupIndex].links.push({ label: "", to: "" });
          setLocalGroups(newGroups);
          setEditing({ type: 'topic', groupIndex, topicIndex: newGroups[groupIndex].links.length - 1 });
     };

     const handleSaveName = (text: string) => {
          if (!editing) return;
          const newGroups = [...localGroups];

          if (editing.type === 'section') {
               newGroups[editing.groupIndex].title = text || "Nova Seção";
          }
          else if (editing.type === 'topic' && typeof editing.topicIndex === 'number') {
               const label = text || "Novo Tópico";

               // Slug do tópico
               const topicSlug = label
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '');

               // Slug da seção (usando o título do grupo)
               const sectionTitle = newGroups[editing.groupIndex].title || "sem-secao";
               const sectionSlug = sectionTitle
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '');

               // Monta o path final: /docs/{secao}/{topico}
               const newPath = `/docs/${sectionSlug}/${topicSlug}`;

               const links = newGroups[editing.groupIndex].links;
               if (links) {
                    links[editing.topicIndex] = {
                         label: label,
                         to: newPath
                    };

                    navigate(newPath);
               }
          }


          setLocalGroups(newGroups);
          setEditing(null);
     };

     const handleKeyDown = (e: React.KeyboardEvent, text: string) => {
          if (e.key === 'Enter') handleSaveName(text);
     };

     return (
          <main className='mainSidebar-main'>
               {/* --- ÁREA ESQUERDA (SIDEBAR) --- */}
               {variant === "docs" && (
                    <div className='mainSidebar-links'>
                         <Link to="/docs" className='introducao'><h4>Introdução</h4></Link>

                         {localGroups.map((group, gIndex) => (
                              <Group
                                   key={gIndex}
                                   title={
                                        editing?.type === 'section' && editing.groupIndex === gIndex ? (
                                             <input
                                                  ref={inputRef}
                                                  defaultValue={String(group.title)}
                                                  onBlur={(e) => handleSaveName(e.target.value)}
                                                  onKeyDown={(e) => handleKeyDown(e, e.currentTarget.value)}
                                                  className="sidebar-input"
                                             />
                                        ) : group.title
                                   }
                              >
                                   {(group.links || []).map((link, tIndex) => (
                                        <div key={tIndex}>
                                             {editing?.type === 'topic' && editing.groupIndex === gIndex && editing.topicIndex === tIndex ? (
                                                  <input
                                                       ref={inputRef}
                                                       defaultValue={link.label}
                                                       onBlur={(e) => handleSaveName(e.target.value)}
                                                       onKeyDown={(e) => handleKeyDown(e, e.currentTarget.value)}
                                                       className="sidebar-input-topic"
                                                       placeholder="Nome do tópico..."
                                                  />
                                             ) : (
                                                  <Link to={link.to}>{link.label}</Link>
                                             )}
                                        </div>
                                   ))}
                                   <div style={{ marginTop: '8px' }}>
                                        <DocButton
                                             action={(e) => { e.stopPropagation(); handleAddTopic(gIndex); }}
                                             style='outline' text='+ Tópico' width='100%' height='24px' borderRadius='4px'
                                        />
                                   </div>
                              </Group>
                         ))}

                         <div style={{ margin: '12px 0' }} />
                         <DocButton action={handleAddSection} style='outline' text='Adicionar Seção' width='100%' height='32px' borderRadius='8px' />
                    </div>
               )}
          </main>
     );
};

export default SidebarLayout;