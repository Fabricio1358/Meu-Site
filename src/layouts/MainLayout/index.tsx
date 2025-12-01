// src\layouts\MainLayout\index.tsx
import './MainLayout.css'
import { Outlet } from 'react-router-dom';

// Components
import Header from '@/components/layout/Header'
import MainSidebar from '@/components/layout/MainSidebar'

export const MainLayout = () => {
     return (
          <main className='mainLayout-main'>
               <MainSidebar />

               <section className='mainLayout-section'>
                    <Header />

                    <div className='mainLayout-outlet'>
                         <Outlet />
                    </div>
               </section>
          </main>
     );
};