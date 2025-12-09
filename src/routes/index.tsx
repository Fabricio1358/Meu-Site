// src\routes\index.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from '@/layouts/MainLayout';
import ConsoleBarController from '@/components/ConsoleBar/ConsoleBarController';

// Features
const Home = lazy(() => import('@/features/home'));
import { DocRoutes } from '@/features/doc/routes';

// Loading
const Loading = () => <div style={{ padding: 20 }}>Carregando...</div>;

export const AppRoutes = () => {
     return (
          <BrowserRouter>
               <ConsoleBarController>
                    <Suspense fallback={<Loading />}>
                         <Routes>
                              <Route element={<MainLayout />}>
                                   <Route path="/" element={<Home />} />

                                   {/* Doc */}
                                   {DocRoutes}

                                   <Route path="*" element={<div>Página não encontrada</div>} />
                              </Route>
                         </Routes>
                    </Suspense>
               </ConsoleBarController>
          </BrowserRouter>
     );
};