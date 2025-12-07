import { useLocation } from "react-router-dom";
import DocLayout from '@/components/layout/DocLayout';
import { useFirestore } from '@/hooks/useFirestore';

// Tipagem do dado que vem do banco (Precisamos expandir isso no futuro)
interface LinkType {
     label: string;
     to: string;
     // Futuramente você vai salvar isso no banco também:
     description?: string;
     createdAt?: number;
}

interface SecaoFirestore {
     id?: string;
     links: LinkType[];
}

const DocViewer = () => {
     const { pathname } = useLocation(); // Pega a URL completa: /docs/secao/topico

     // Busca todas as seções (Idealmente buscaríamos só a necessária, mas sua estrutura atual pede isso)
     const { data: sections, loading } = useFirestore<SecaoFirestore>(
          'DocSidebarSecoes',
          [] // Sem ordenação específica por enquanto ou use a sua padrão
     );

     if (loading) return <div style={{ padding: '20px' }}>Carregando documento...</div>;

     // --- LÓGICA DE BUSCA ---
     // Precisamos encontrar qual tópico (dentro de qual seção) corresponde à URL atual
     let foundTopic: LinkType | null = null;

     for (const section of sections) {
          if (section.links) {
               const match = section.links.find(link => link.to === pathname);
               if (match) {
                    foundTopic = match;
                    break; // Achamos! Para o loop.
               }
          }
     }

     // Se não achou nada (URL inválida ou digitada errada)
     if (!foundTopic) {
          return (
               <div style={{ padding: '40px' }}>
                    <h2>404 - Tópico não encontrado</h2>
                    <p>O caminho <code>{pathname}</code> não existe.</p>
               </div>
          );
     }

     // --- RENDERIZAÇÃO ---
     // Aqui usamos o seu DocLayout como template!
     return (
          <DocLayout
               // Usa o label do tópico como título
               title={foundTopic.label}

               // Como ainda não salvamos data no tópico, usamos a data atual ou um placeholder
               date={foundTopic.createdAt ? new Date(foundTopic.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}

               // Como ainda não salvamos descrição, usamos um placeholder
               description={foundTopic.description || `Conteúdo sobre ${foundTopic.label}`}
          >
               {/* AQUI VAI O CONTEÚDO REAL DO TÓPICO (O texto grande).
                Por enquanto, como não temos um campo "content" no banco,
                vou colocar um texto genérico.
            */}
               <div className="conteudo-dinamico">
                    <p>Este é o conteúdo dinâmico carregado do Firestore para o tópico <strong>{foundTopic.label}</strong>.</p>
                    <p>Futuramente, aqui aparecerá o texto rico que você salvar num editor.</p>
               </div>
          </DocLayout>
     );
};

export default DocViewer;