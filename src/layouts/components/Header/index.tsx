// src\layouts\components\Header\index.tsx
import './Header.css'
import { Link } from 'react-router-dom'

// Types
import type { HeaderProps } from '@/types/HeaderTypes';

const Header = ({ onSetSidebar }: HeaderProps) => {
     return (
          <header id='header'>
               <div className="header-links">
                    <Link to="/docs" onClick={() => onSetSidebar(true)}>
                         <h4>Doc</h4>
                    </Link>
               </div>
          </header>
     )
}

export default Header;