/* eslint-disable @typescript-eslint/no-explicit-any */
// src\hooks\useFirestore.ts
import { useState, useEffect, useRef } from 'react';
import { type QueryConstraint } from 'firebase/firestore';
import { firestoreService } from '@/services/firestoreService';

// Components
import { useConsoleBar } from '@/components/ConsoleBar/ConsoleBarContext';

export const useFirestore = <T extends { id?: string }>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) => {
    const { openBar } = useConsoleBar();
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const constraintsRef = useRef(constraints);

    if (JSON.stringify(constraintsRef.current) !== JSON.stringify(constraints)) {
        constraintsRef.current = constraints;
    }

    useEffect(() => {
        setLoading(true);
        const unsubscribe = firestoreService.listen<T>(
            collectionName,
            (newData) => {
                setData(newData);
                setLoading(false);
                setError(null);
            },
            constraintsRef.current
        );

        return () => unsubscribe();
    }, [collectionName]);

    const create = async (newData: Omit<T, 'id'> | T) => {
        try {
            setError(null);
            const id = await firestoreService.create(collectionName, newData);
            return id;
        } catch (error: any) {
          openBar({
                    info: "Erro ao criar:",
                    error: error,
                    code: 500,
                    backgroundColor: "red",
                    type: "Error"
               })
            setError(error.message || 'Erro ao criar');
            throw error;
        }
    };

    const createComId = async (newData: T, id: string) => {
        try {
            setError(null);
            await firestoreService.createWithId(collectionName, id, newData);
            return id;
        } catch (error: any) {
          openBar({
                    info: "Erro ao criar com ID:",
                    error: error,
                    code: 500,
                    backgroundColor: "red",
                    type: "Error"
               })
            setError(error.message || 'Erro ao criar com ID');
            throw error;
        }
    };

    const update = async (id: string, updateData: Partial<T>) => {
        try {
            setError(null);
            await firestoreService.update(collectionName, id, updateData);
        } catch (error: any) {
          openBar({
                    info: "Erro ao atualizar:",
                    error: error,
                    code: 500,
                    backgroundColor: "red",
                    type: "Error"
               })
            setError(error.message || 'Erro ao atualizar');
            throw error;
        }
    };

    const remove = async (id: string) => {
        try {
            setError(null);
            await firestoreService.delete(collectionName, id);
        } catch (error: any) {
          openBar({
                    info: "Erro ao deletar:",
                    error: error,
                    code: 500,
                    backgroundColor: "red",
                    type: "Error"
               })
            setError(error.message || 'Erro ao deletar');
            throw error;
        }
    };

    return {
        data,
        loading,
        error,
        create,
        createComId,
        update,
        remove
    };
};

// Hook para ouvir um único documento
export const useDocument = <T>(collectionName: string, documentId: string) => {
    const [document, setDocument] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!documentId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = firestoreService.listenDoc<T>(
            collectionName,
            documentId,
            (doc) => {
                setDocument(doc);
                setLoading(false);
                setError(null);
            }
        );

        return unsubscribe;
    }, [collectionName, documentId]);

    return { document, loading, error };
};