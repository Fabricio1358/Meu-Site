// src/routes/index.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MainLayout } from '@/layouts/MainLayout';
import { DocRoutes } from '@/features/doc/routes';

const Home = lazy(() => import('@/pages/home'));

const Loading = () => <div style={{ padding: 20 }}>Carregando...</div>;

export const AppRoutes = () => {
     return (
          <BrowserRouter>
               <Suspense fallback={<Loading />}>
                    <Routes>
                         <Route element={<MainLayout />}>
                              <Route path="/" element={<Home />} />

                              {DocRoutes}

                              <Route path="*" element={<div>Página não encontrada</div>} />
                         </Route>
                    </Routes>
               </Suspense>
          </BrowserRouter>
     );
};