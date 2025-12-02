// src\components\layout\SidebarLayout\index.tsx
import { Link } from 'react-router-dom';
import './SidebarLayout.css'

// UI
import Group from "@/components/ui/Group"
import type React from 'react';

// Types
import type GroupType from "@/types/GroupType"

interface SidebarLayoutProps {
     children?: React.ReactNode;
     variant: "docs" | "custom" | "none";
     groups?: GroupType[];
}

const SidebarLayout = ({ children, variant, groups }: SidebarLayoutProps) => {
     return (
          <main className='mainSidebar-main'>
               {/* Cards rápidos */}
               <div></div>

               {/* Variant - Docs */}
               {variant === "docs" && (
                    <div className='mainSidebar-links'>
                         <Link to="/docs" className='introducao'>
                              <h4>Introdução</h4>
                         </Link>
                         {groups?.map((group) => (
                              <Group key={group.title} title={group.title}>
                                   {(group.links || []).map((link) => (
                                        <Link key={link.to} to={link.to}>
                                             {link.label}
                                        </Link>
                                   ))}
                              </Group>
                         ))}
                    </div>
               )}

               {/* Variant - Custom */}
               {variant === "custom" && children}

               {/* Variant - None */}
               {variant === "none" && null}

          </main >
     )
}

export default SidebarLayout;