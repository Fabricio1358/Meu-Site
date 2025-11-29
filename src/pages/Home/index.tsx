import { Helmet } from 'react-helmet-async';

const Home = () => {
     return (
          <div>
               <Helmet>
                    <title>Início | Meu Site</title>
                    <meta name="description" content="Página inicial do meu site pessoal" />
               </Helmet>

               <h1>Bem-vindo ao meu Playground</h1>
               <p>Essa estrutura está pronta para escalar.</p>
          </div>
     );
};

export default Home;