// src/features/doc/components/docSidebar/index.tsx
import SidebarLayout from "@/components/layout/SidebarLayout";
import groups from "../../data/groups";

const DocSidebar = () => {
     return (
          <>
               <SidebarLayout variant="docs" groups={groups} />
          </>
     )
};

export default DocSidebar;
