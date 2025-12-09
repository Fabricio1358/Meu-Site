// src\components\ConsoleBar\ConsoleBarContext.tsx
import { createContext, useContext } from "react";

// Types
import type { ConsoleBarContextType } from "@/types/ConsoleBarTypes";

export const ConsoleBarContext = createContext<ConsoleBarContextType>({
     openBar: () => { },
});

// Hook para usar o contexto
export const useConsoleBar = () => useContext(ConsoleBarContext);