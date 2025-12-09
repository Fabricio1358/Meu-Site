// src\services\firestoreService.ts
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    type DocumentData,
    type QueryConstraint,
    type Unsubscribe
} from 'firebase/firestore';
import { db } from '../config/firebase';

// pseudo: services/firestoreService.ts (dentro da função update)
import { sanitizeForFirestore } from './firestoreHelpers';

export interface FirestoreService {
    // CRUD básico
    create<T>(collectionName: string, data: T): Promise<string>;
    createWithId<T>(collectionName: string, id: string, data: T): Promise<void>;
    get<T>(collectionName: string, id: string): Promise<T | null>;
    update(collectionName: string, id: string, data: Partial<unknown>): Promise<void>;
    delete(collectionName: string, id: string): Promise<void>;

    // Queries e Listeners
    getAll<T>(collectionName: string, constraints?: QueryConstraint[]): Promise<T[]>;
    listen<T>(collectionName: string, callback: (data: T[]) => void, constraints?: QueryConstraint[]): Unsubscribe;
    listenDoc<T>(collectionName: string, id: string, callback: (data: T | null) => void): Unsubscribe;
}

class FirebaseFirestoreService implements FirestoreService {
    
    // Cria um documento com ID automático gerado pelo Firestore
    async create<T>(collectionName: string, data: T): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, collectionName), data as DocumentData);
            return docRef.id;
        } catch (error) {
            throw new Error(`Erro ao criar documento: ${error}`);
        }
    }

    // Cria (ou sobrescreve) um documento com um ID específico definido por você
    async createWithId<T>(collectionName: string, id: string, data: T): Promise<void> {
        try {
            const docRef = doc(db, collectionName, id);
            await setDoc(docRef, data as DocumentData);
        } catch (error) {
            throw new Error(`Erro ao criar documento com ID: ${error}`);
        }
    }

    async get<T>(collectionName: string, id: string): Promise<T | null> {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as T;
            }
            return null;
        } catch (error) {
            throw new Error(`Erro ao buscar documento: ${error}`);
        }
    }

    async update(collectionName: string, id: string, data: Partial<unknown>): Promise<void> {
     const sanitized = sanitizeForFirestore(data);
     
        try {
            const docRef = doc(db, collectionName, id);

            const snap = await getDoc(docRef);
            if (!snap.exists()) throw new Error("Documento não encontrado!");
            
            await updateDoc(docRef, sanitized as DocumentData);
        } catch (error) {
            throw new Error(`Erro ao atualizar documento: ${error}`);
        }
    }

    async delete(collectionName: string, id: string): Promise<void> {
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            throw new Error(`Erro ao deletar documento: ${error}`);
        }
    }

    async getAll<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
        try {
            const q = query(collection(db, collectionName), ...constraints);
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as T));
        } catch (error) {
            throw new Error(`Erro ao buscar documentos: ${error}`);
        }
    }

    listen<T>(
        collectionName: string,
        callback: (data: T[]) => void,
        constraints: QueryConstraint[] = []
    ): Unsubscribe {
        const q = query(collection(db, collectionName), ...constraints);

        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as T));
            callback(data);
        }, (error) => {
            console.error('Erro no listener:', error);
        });
    }

    listenDoc<T>(
        collectionName: string,
        id: string,
        callback: (data: T | null) => void
    ): Unsubscribe {
        const docRef = doc(db, collectionName, id);

        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({ id: docSnap.id, ...docSnap.data() } as T);
            } else {
                callback(null);
            }
        }, (error) => {
            console.error('Erro no listener do documento:', error);
        });
    }
}

export const firestoreService = new FirebaseFirestoreService();

export const queryHelpers = {
    whereEqual: (field: string, value: unknown) => where(field, '==', value),
    whereIn: (field: string, values: unknown[]) => where(field, 'in', values),
    orderByAsc: (field: string) => orderBy(field, 'asc'),
    orderByDesc: (field: string) => orderBy(field, 'desc'),
    limitTo: (count: number) => limit(count)
};