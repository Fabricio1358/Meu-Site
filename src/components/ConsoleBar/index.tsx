// src\components\ConsoleBar\index.tsx
import './ConsoleBar.css';

// Types
import type { ConsoleBarProps } from '@/types/ConsoleBarTypes';

// Função específica para tratar unknown para string
function formatError(err: unknown): string {
     if (err instanceof Error) return err.message;
     if (typeof err === "string") return err;
     try {
          return JSON.stringify(err);
     } catch {
          return String(err);
     }
}

const ConsoleBar = ({ info, code, error, backgroundColor, isVisible }: ConsoleBarProps) => {
     const formattedError = error ? formatError(error) : null;

     return (
          <div
               className={`console-bar ${isVisible ? "visible" : ""}`}
               style={{ backgroundColor }}
          >
               {code && `${code} - `}
               {info}
               {formattedError && ` - ${formattedError}`}
          </div>
     );
};

export default ConsoleBar;