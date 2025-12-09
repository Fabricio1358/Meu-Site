export interface ConsoleBarProps {
     info: string;
     error?: unknown
     code?: number;
     backgroundColor: string;
     type: 'Success' | 'Error' | 'Warning' | 'Information';
     isVisible: boolean;
     onClose: () => void;
}

export interface OpenBarParams {
     info: string;
     error?: unknown
     code?: number;
     backgroundColor: string;
     type: 'Success' | 'Error' | 'Warning' | 'Information';
}

export interface ConsoleBarContextType {
     openBar: (params: OpenBarParams) => void;
}