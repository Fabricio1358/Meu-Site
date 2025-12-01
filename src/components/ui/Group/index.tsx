// src\components\ui\Group\index.tsx
import './Group.css'
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface GroupProps {
     title: string;
     children: React.ReactNode;
}

const Group = ({ title, children }: GroupProps) => {
     const [isOpen, setIsOpen] = useState(false)

     return (
          <div className='group'>
               <button
                    className={`group-trigger ${isOpen ? "active" : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
               >
                    <ChevronRight
                         size={16}
                         className={`arrow-icon ${isOpen ? "rotate" : ""}`}
                    />
                    <h4 className='group-title'>{title}</h4>
               </button>

               <div className={`group-content ${isOpen ? "open" : ""}`}>
                    <div className="group-content-inner">
                         {children}
                    </div>
               </div>
          </div>
     )
}

export default Group;