// Module imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Styles
import './App.css';

// Components
import Loading from './components/Loading/loading.tsx';

// Assets

// Pages
import Home from './pages/home/home.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loading destino="home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/utils" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
