// src\layouts\MainLayout\index.tsx
import './MainLayout.css'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

import Header from '@/components/Header'
import DocSidebar from '@/features/doc/components/docSidebar';

export const MainLayout = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
     const location = useLocation();

     const isDocRoute = location.pathname.startsWith("/docs");

     return (
          <main className='mainLayout-main'>
               <div className='mainLayout-side'>
                    {/* Titulo + Sidebar */}
                    <div className='mainLayout-titulo'>
                         <Link to="/">
                              <h3>Meu Site</h3>
                         </Link>
                         <p>temp v1.0.0</p>
                    </div>

                    {isSidebarOpen && isDocRoute && (
                         <div className="mainLayout-nav-container">
                              <DocSidebar />
                         </div>
                    )}
               </div>

               {/* Header + Content */}
               <section className='mainLayout-content'>
                    <Header onSetSidebar={setIsSidebarOpen} />

                    <div className="mainLayout-page-scroll">
                         <Outlet />
                    </div>
               </section>
          </main>
     );
};