// src\layouts\MainLayout\index.tsx
import './MainLayout.css'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

// Components
import Header from '@/layouts/components/Header'

// Sidebars
import DocSidebar from '@/features/doc/components/DocSidebar';

export const MainLayout = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
     const location = useLocation();
     const isDocRoute = location.pathname.startsWith("/docs");
     return (
          <main className='mainLayout-main'>
               <div className='mainLayout-side'>
                    <div className='mainLayout-titulo'>
                         <Link to="/">
                              <h3>Meu Site</h3>
                         </Link>
                         <p>temp v1.0.0</p>
                    </div>

                    {/* DocSidebar */}
                    {isSidebarOpen && isDocRoute && (
                         <div className="mainLayout-nav-container">
                              <DocSidebar />
                         </div>
                    )}
               </div>

               <section className='mainLayout-content'>
                    <Header onSetSidebar={setIsSidebarOpen} />

                    <div className="mainLayout-page-scroll">
                         <Outlet />
                    </div>
               </section>
          </main>
     );
};
