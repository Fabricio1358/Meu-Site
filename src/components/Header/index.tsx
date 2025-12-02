// src/components/Header/index.tsx
import './Header.css'
import { Link } from 'react-router-dom'

interface HeaderProps {
     onSetSidebar: (value: boolean) => void
}

const Header = ({ onSetSidebar }: HeaderProps) => {
     return (
          <header>
               {/* Título e versão */}
               <div className='header-titulo'>
                    <Link to="/" onClick={() => onSetSidebar(false)}>
                         <h3>Meu Site</h3>
                    </Link>
                    <p>temp v1.0.0</p>
               </div>

               <div className="header-links">
                    <Link to="/docs" onClick={() => onSetSidebar(true)}>
                         <h4>Doc</h4>
                    </Link>

                    <Link to="/" onClick={() => onSetSidebar(false)}>
                         <h4>Link 2</h4>
                    </Link>

                    <Link to="/" onClick={() => onSetSidebar(false)}>
                         <h4>Link 3</h4>
                    </Link>
               </div>
          </header>
     )
}

export default Header;
