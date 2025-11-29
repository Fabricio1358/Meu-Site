// React
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Views
import Home from "../pages/home/home.tsx"
import Teste from "../pages/teste/teste.tsx"

export default function AppRoutes() {
     return (
          <BrowserRouter>
               <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/teste' element={<Teste />} />
               </Routes>
          </BrowserRouter>
     )
}