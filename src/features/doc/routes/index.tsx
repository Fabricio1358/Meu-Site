import { Route } from "react-router-dom";
import { lazy } from "react";

// Página inicial da documentação (Estática)
const DocIntroducao = lazy(() => import("../pages"));

// Página Genérica que vai carregar o conteúdo dinamicamente
const DocViewer = lazy(() => import("../pages/DocViewer"));

export const DocRoutes = (
     <>
          {/* Rota raiz /docs */}
          <Route path="docs" element={<DocIntroducao />} />

          {/* Rota Dinâmica:
             - :sectionSlug vai pegar "desenvolvimento", "instalacao", etc.
             - :topicSlug vai pegar "ideias", "passo-a-passo", etc.
          */}
          <Route path="docs/:sectionSlug/:topicSlug" element={<DocViewer />} />
     </>
);