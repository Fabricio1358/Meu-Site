import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type LoadingPageProps = {
  destino: string;
};

function LoadingPage({ destino }: LoadingPageProps) {
  const navigate = useNavigate();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(interval);
      navigate(`/${destino}`);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, destino]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Carregando{dots}</h1>
    </div>
  );
}

export default LoadingPage;
