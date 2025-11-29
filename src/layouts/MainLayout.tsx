import { Outlet, Link } from 'react-router-dom';

export const MainLayout = () => {
     return (
          <div className="min-h-screen flex flex-col">
               {/* Header */}
               <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    <nav style={{ display: 'flex', gap: '1rem' }}>
                         {/* Use Link ao invés de <a> para não recarregar a página */}
                         <Link to="/">Home</Link>
                         <Link to="/about">Sobre</Link>
                    </nav>
               </header>

               {/* Conteúdo Variável */}
               <main style={{ flex: 1, padding: '1rem' }}>
                    <Outlet />
               </main>

               {/* Footer */}
               <footer style={{ padding: '1rem', borderTop: '1px solid #ddd' }}>
                    <p>&copy; {new Date().getFullYear()} Meu Site Modular</p>
               </footer>
          </div>
     );
};