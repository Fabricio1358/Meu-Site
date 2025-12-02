// src\layouts\MainLayout\index.tsx
import './MainLayout.css'
import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

import Header from '@/components/Header'
import DocSidebar from '@/features/doc/components/docSidebar';

export const MainLayout = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
     const location = useLocation();

     const isDocRoute = location.pathname.startsWith("/docs");

     return (
          <main className='mainLayout-main'>
               <Header onSetSidebar={setIsSidebarOpen} />

               <section className='mainLayout-section'>

                    {isSidebarOpen && isDocRoute && (
                         <DocSidebar />
                    )}

                    <div className='mainLayout-outlet'>
                         <Outlet />
                    </div>

               </section>
          </main>
     );
};
