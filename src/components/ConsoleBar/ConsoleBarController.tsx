// src\components\ConsoleBar\ConsoleBarController.tsx
import { useRef, useState, useCallback } from "react";

// Components
import ConsoleBar from "@/components/ConsoleBar";
import { ConsoleBarContext } from "../../components/ConsoleBar/ConsoleBarContext";

// Types
import type { OpenBarParams } from "@/types/ConsoleBarTypes";

const ANIMATION_DURATION = 350;

const ConsoleBarController = ({ children }: { children: React.ReactNode }) => {
     const [isMounted, setIsMounted] = useState(false);
     const [isVisible, setIsVisible] = useState(false);
     const [barData, setBarData] = useState<OpenBarParams | null>(null);
     const timeoutRef = useRef<NodeJS.Timeout | null>(null);

     const openBar = (data: OpenBarParams, duration = 3000) => {
          setBarData(data);
          setIsMounted(true);

          // garante que a classe visible só entra depois de montado
          requestAnimationFrame(() => {
               requestAnimationFrame(() => {
                    setIsVisible(true);
               });
          });

          // auto close
          if (duration > 0) {
               timeoutRef.current = setTimeout(() => {
                    setIsVisible(false);

                    setTimeout(() => {
                         setIsMounted(false);
                         setBarData(null);
                    }, ANIMATION_DURATION);
               }, duration);
          }
     };

     const closeBar = useCallback(() => {
          if (timeoutRef.current) {
               clearTimeout(timeoutRef.current);
          }

          setIsVisible(false);

          timeoutRef.current = setTimeout(() => {
               setIsMounted(false);
               setBarData(null);
          }, ANIMATION_DURATION);
     }, []);

     return (
          <ConsoleBarContext.Provider value={{ openBar }}>
               {children}

               {isMounted && barData && (
                    <ConsoleBar
                         error={barData?.error}
                         code={barData?.code}
                         backgroundColor={barData.backgroundColor}
                         type={barData.type}
                         isVisible={isVisible}
                         onClose={closeBar}
                         info={barData.info}
                    />
               )}
          </ConsoleBarContext.Provider>
     );
};

export default ConsoleBarController;