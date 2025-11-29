import { lazy, Suspense } from 'react'; // <--- Importante
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

// --- IMPORTAÇÕES PREGUIÇOSAS (LAZY) ---
const Home = lazy(() => import('@/pages/home'));

const ProjectsPlaceholder = () => <h1>Experimentos (Em breve)</h1>;

// Um componente simples de Loading para aparecer na troca de tela
const Loading = () => <div className="p-4 text-center">Carregando...</div>;

export const AppRoutes = () => {
     return (
          <BrowserRouter>
               {/* O Suspense precisa envolver as rotas que são Lazy */}
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