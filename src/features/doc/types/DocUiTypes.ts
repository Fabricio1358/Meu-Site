import type { MouseEventHandler } from "react";

export default interface GroupType {
     title: string;
     links?: { label: string; to: string }[];
}

export interface GroupProps {
     title: React.ReactNode;
     children: React.ReactNode;
}

export interface DocButtonProps {
     action: MouseEventHandler;
     style: 'whole' | 'outline';
     text?: string;
     width: string;
     height: string;
     border?: string;
     borderRadius?: string;
}

export type BlockType = 'paragraph' | 'heading' | 'list';

export interface Block {
     id: string;
     type: BlockType;
     content: string;
     level?: 2 | 3;
}

export interface EditorBlockProps {
     block: Block;
     updateBlock: (id: string, content: string) => void;
     transformBlock: (id: string, newType: BlockType, newLevel?: 2 | 3) => void;
     addBlock: (currentId: string) => void;
     removeBlock: (id: string) => void;
     focusId: string | null;
     isLastBlock: boolean;
}