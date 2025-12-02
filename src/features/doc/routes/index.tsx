// src/features/doc/routes/index.tsx
import { Route } from "react-router-dom";
import { lazy } from "react";

const DocIntroducao = lazy(() => import("../pages"));
const DocMateria1 = lazy(() => import("../pages/Materia1/Topico1"));

export const DocRoutes = (
     <>
          <Route path="docs" element={<DocIntroducao />} />
          <Route path="docs/materia1/topico1" element={<DocMateria1 />} />
     </>
);
