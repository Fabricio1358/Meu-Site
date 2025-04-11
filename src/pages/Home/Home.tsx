import { Link } from 'react-router-dom';
import './Home.css';

const projects = [
  {
    id: 1,
    title: 'Projeto 1',
    description: 'Descrição detalhada do projeto 1...',
    link: '/projeto1'
  },
  {
    id: 2,
    title: 'Projeto 2',
    description: 'Descrição detalhada do projeto 2...',
    link: '/projeto2'
  },
];

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo</h1>
      <p>Esta é a página inicial do meu site pessoal</p>
      <div className="projects-section">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <Link to={project.link} className="project-link">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;