/* eslint-disable @typescript-eslint/no-explicit-any */
// services/firestoreHelpers.ts
export function sanitizeForFirestore(value: any): any {
  if (value === undefined) return undefined; // caller must omit this property
  if (value === null) return null;
  if (Array.isArray(value)) {
    // map and sanitize; remove undefined entries (Firestore allows null in arrays)
    return value.map(v => sanitizeForFirestore(v)).filter(v => v !== undefined);
  }
  if (value instanceof Date) {
    return value.toISOString(); // ou use firestore.timestamp se preferir
  }
  if (typeof value === 'object' && value !== null) {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined) continue; // remove chave com undefined
      if (typeof v === 'function') continue; // remove funções
      const sanitized = sanitizeForFirestore(v);
      if (sanitized === undefined) continue;
      out[k] = sanitized;
    }
    return out;
  }
  // primitivos: string, number, boolean
  return value;
}

/** Opcional: função que retorna os caminhos com undefined (debug) */
export function findUndefinedPaths(obj: any, prefix = ''): string[] {
  const paths: string[] = [];
  if (obj === undefined) {
    paths.push(prefix || '(root)');
    return paths;
  }
  if (obj === null) return paths;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      paths.push(...findUndefinedPaths(v, `${prefix}[${i}]`));
    });
    return paths;
  }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (v === undefined) paths.push(path);
      else paths.push(...findUndefinedPaths(v, path));
    }
  }
  return paths;
}
