// src\features\doc\pages\Materia1\Topico1\index.tsx

// Layout
import DocLayout from '@/components/layout/DocLayout';

const Topico1 = () => {
     return (
          <DocLayout
               date={"06/12/2025"}
               title={"Ideiais para o futuro"}
               description={'Lista de ideias para novas adições no site!'}
               sections={[
                    {
                         subTitle: "Lista de ideias:",
                         content: "Isso aqui é um sistema feito afim de testes de modularidade de documentação"
                    },
                    {
                         content: "Isso aqui é um sistema feito afim de testes de modularidade de documentação"
                    },
               ]}
          />
     )
}

export default Topico1;