/* eslint-disable @typescript-eslint/no-explicit-any */
// src\hooks\useFirestore.ts
import { useState, useEffect, useRef } from 'react';
import { type QueryConstraint } from 'firebase/firestore';
import { firestoreService } from '@/services/firestoreService';

export const useFirestore = <T extends { id?: string }>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) => {
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
        } catch (err: any) {
            setError(err.message || 'Erro ao criar');
            throw err;
        }
    };

    const createComId = async (newData: T, id: string) => {
        try {
            setError(null);
            await firestoreService.createWithId(collectionName, id, newData);
            return id;
        } catch (err: any) {
            setError(err.message || 'Erro ao criar com ID');
            throw err;
        }
    };

    const update = async (id: string, updateData: Partial<T>) => {
        try {
            setError(null);
            await firestoreService.update(collectionName, id, updateData);
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar');
            throw err;
        }
    };

    const remove = async (id: string) => {
        try {
            setError(null);
            await firestoreService.delete(collectionName, id);
        } catch (err: any) {
            setError(err.message || 'Erro ao deletar');
            throw err;
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