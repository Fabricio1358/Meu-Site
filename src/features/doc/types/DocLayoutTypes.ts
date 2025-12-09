import type { Block } from "@/types/temp";

export interface DocLayoutProps {
     documentId: string;
     collectionName?: string;
}

export default interface DocLayoutType {
     subTitle: string;
     content: string;
}

export interface SidebarLayoutProps {
     variant: "docs" | "custom" | "none";
}

// Estrutura padronizada dos links
export interface LinkType {
     label: string;
     to: string;
     createdAt: number;
}

export interface SecaoFirestore {
     id?: string;
     title: string;
     links: LinkType[];
     createdAt: number;
}

export interface DocumentData {
     id?: string;
     date: string;
     title: string;
     description: string;
     blocks: Block[];
     updatedAt: number;
}