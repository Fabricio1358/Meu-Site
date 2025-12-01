// src\components\layout\MainSidebar\index.tsx
import { Link } from 'react-router-dom';
import './MainSidebar.css'

// UI
import Group from "@/components/ui/Group"

const MainSidebar = () => {
     return (
          <main className='mainSidebar-main'>
               {/* Título e versão */}
               <div className='mainSidebar-titulo'>
                    <Link to={"/"}><h3>Meu Site</h3></Link>
                    <p>temp v1.0.0</p>
               </div>
               {/* Cards rápidos */}
               <div></div>
               {/* Links */}
               <div className='mainSidebar-links'>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                         <Link to={'/'}>link 3</Link>
                         <Link to={'/'}>link 4</Link>
                    </Group>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                    </Group>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                         <Link to={'/'}>link 3</Link>
                         <Link to={'/'}>link 4</Link>
                         <Link to={'/'}>link 5</Link>
                    </Group>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                         <Link to={'/'}>link 3</Link>
                         <Link to={'/'}>link 4</Link>
                    </Group>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                    </Group>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                         <Link to={'/'}>link 3</Link>
                         <Link to={'/'}>link 4</Link>
                         <Link to={'/'}>link 5</Link>
                    </Group>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                         <Link to={'/'}>link 3</Link>
                         <Link to={'/'}>link 4</Link>
                    </Group>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                    </Group>
                    <Group title='Teste'>
                         <Link to={'/'}>link 1</Link>
                         <Link to={'/'}>link 2</Link>
                         <Link to={'/'}>link 3</Link>
                         <Link to={'/'}>link 4</Link>
                         <Link to={'/'}>link 5</Link>
                    </Group>
               </div>
          </main>
     )
}

export default MainSidebar;