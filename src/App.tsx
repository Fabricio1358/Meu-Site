import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <div id="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<div>Página Sobre Mim em construção</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;