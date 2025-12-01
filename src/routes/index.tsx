// src\routes\index.tsx
import { lazy, Suspense } from 'react'; // <--- Importante
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

// --- IMPORTAÇÕES PREGUIÇOSAS (LAZY) ---
const Home = lazy(() => import('@/pages/home'));

const ProjectsPlaceholder = () => <h1>Experimentos (Em breve)</h1>;

const Loading = () => <div>Carregando...</div>;

export const AppRoutes = () => {
     return (
          <BrowserRouter>
               <Suspense fallback={<Loading />}>
                    <Routes>
                         <Route element={<MainLayout />}>

                              <Route path="/" element={<Home />} />

                              <Route path="/projects" element={<ProjectsPlaceholder />} />

                              <Route path="*" element={<div>Página não encontrada</div>} />
                         </Route>
                    </Routes>
               </Suspense>
          </BrowserRouter>
     );
};