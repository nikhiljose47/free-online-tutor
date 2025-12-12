import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  collectionData,
  docData,
  addDoc,
} from '@angular/fire/firestore';

import { from, map, catchError, of, Observable } from 'rxjs';

// --------------------------------------------------
// ⭐ Generic Response Model
// --------------------------------------------------
export interface FireResponse<T> {
  ok: boolean;
  data: T | T[] | null;
  message?: string | null;
}

@Injectable({ providedIn: 'root' })
export class FirestoreDocService {
  private db = inject(Firestore);

  // --------------------------------------------------
  // ⭐ Helpers
  // --------------------------------------------------

  private success<T>(data: T | T[] | null): FireResponse<T> {
    return { ok: true, data };
  }

  private fail<T>(msg: string): FireResponse<T> {
    return { ok: false, data: null, message: msg };
  }

  // --------------------------------------------------
  // ⭐ Collection + Document references
  // --------------------------------------------------

  private col<T>(path: string) {
    return collection(this.db, path) as any;
  }

  private docRef<T>(path: string, id: string) {
    return doc(this.db, `${path}/${id}`) as any;
  }

  // --------------------------------------------------
  // ⭐ CREATE / SET
  // --------------------------------------------------
  add<T extends Record<string, any>>(path: string, data: T): Observable<FireResponse<T>> {
    const colRef = collection(this.db, path);

    return from(addDoc(colRef, data)).pipe(
      map(
        (ref) =>
          ({
            ok: true,
            id: ref.id,
            data: null,
          } as FireResponse<T>)
      ),
      catchError((err) => of(this.fail<T>(err.message ?? 'Firestore add() error')))
    );
  }

  set<T>(path: string, id: string, data: T): Observable<FireResponse<T>> {
    return from(setDoc(this.docRef<T>(path, id), data)).pipe(
      map(() => this.success<T>(null)),
      catchError((err) => of(this.fail<T>(err.message)))
    );
  }

  // -----------------------------------a---------------
  // ⭐ UPDATE
  // --------------------------------------------------

  update<T>(path: string, id: string, data: Partial<T>): Observable<FireResponse<T>> {
    return from(updateDoc(this.docRef<T>(path, id), data as any)).pipe(
      map(() => this.success<T>(null)),
      catchError((err) => of(this.fail<T>(err.message)))
    );
  }

  // --------------------------------------------------
  // ⭐ DELETE
  // --------------------------------------------------

  delete<T>(path: string, id: string): Observable<FireResponse<T>> {
    return from(deleteDoc(this.docRef(path, id))).pipe(
      map(() => this.success<T>(null)),
      catchError((err) => of(this.fail<T>(err.message)))
    );
  }

  // --------------------------------------------------
  // ⭐ GET ONE DOCUMENT (once)
  // --------------------------------------------------

  getOnce<T>(path: string, id: string): Observable<FireResponse<T>> {
    return from(getDoc(this.docRef<T>(path, id))).pipe(
      map((snap) => {
        if (!snap.exists()) return this.fail<T>('Document not found');

        const d = snap.data() as any;
        const out = { id: snap.id, ...d } as T;

        return this.success<T>(out);
      }),
      catchError((err) => of(this.fail<T>(err.message)))
    );
  }

  // --------------------------------------------------
  // ⭐ LISTEN TO DOCUMENT (realtime)
  // --------------------------------------------------

  listen<T>(path: string, id: string): Observable<FireResponse<T>> {
    return docData(this.docRef<T>(path, id), { idField: 'id' }).pipe(
      map((d) => this.success<T>(d as T)),
      catchError((err) => of(this.fail<T>(err.message)))
    );
  }

  // --------------------------------------------------
  // ⭐ GET ALL DOCUMENTS (once)
  // --------------------------------------------------

  getAllOnce<T>(path: string): Observable<FireResponse<T>> {
    return from(getDocs(this.col<T>(path))).pipe(
      map((snap) => {
        const out: T[] = snap.docs.map((d) => {
          return { id: d.id, ...(d.data() as any) } as T;
        });

        return this.success<T>(out);
      }),
      catchError((err) => of(this.fail<T>(err.message)))
    );
  }

  // --------------------------------------------------
  // ⭐ LISTEN ALL DOCUMENTS (realtime)
  // --------------------------------------------------

  listenAll<T>(path: string): Observable<FireResponse<T>> {
    return collectionData(this.col<T>(path), { idField: 'id' }).pipe(
      map((arr) => this.success<T>(arr as T[])),
      catchError((err) => of(this.fail<T>(err.message)))
    );
  }

  // --------------------------------------------------
  // ⭐ WHERE QUERY
  // --------------------------------------------------

  realtimeWhere<T>(
    path: string,
    field: string,
    op: any,
    value: any,
    limitTo = 50
  ): Observable<FireResponse<T>> {
    const q = query(this.col<T>(path), where(field, op, value), limit(limitTo));

    return collectionData(q, { idField: 'id' } as any).pipe(
      map((arr) => {
        const out = arr as T[];
        return this.success<T>(out);
      }),
      catchError((err) => of(this.fail<T>(err.message ?? 'Firestore realtime where() error')))
    );
  }

  where<T>(
    path: string,
    field: string,
    op: any,
    value: any,
    limitTo = 50
  ): Observable<FireResponse<T>> {
    const q = query(this.col<T>(path), where(field, op, value), limit(limitTo));

    return from(getDocs(q)).pipe(
      map((snap) => {
        const out: T[] = snap.docs.map((d) => {
          return { id: d.id, ...(d.data() as any) } as T;
        });

        return this.success<T>(out);
      }),
      catchError((err) => of(this.fail<T>(err.message)))
    );
  }

  multiWhere<T>(path: string, conditions: { field: string; op: any; value: any }[], limitTo = 5) {
    let q = query(this.col<T>(path));

    conditions.forEach((c) => {
      q = query(q, where(c.field, c.op, c.value));
    });

    return from(getDocs(q)).pipe(
      map((snap) => {
        const out = snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
        return { ok: true, data: out } as FireResponse<T>;
      }),
      catchError((err) => of({ ok: false, data: [], message: err.message } as FireResponse<T>))
    );
  }

  realtimeMultiWhere<T>(
    path: string,
    conditions: { field: string; op: any; value: any }[],
    limitTo = 50
  ): Observable<FireResponse<T>> {
    let q: any = this.col<T>(path);

    for (const c of conditions) {
      q = query(q, where(c.field, c.op, c.value));
    }

    q = query(q, limit(limitTo));

    return collectionData(q, { idField: 'id' } as any).pipe(
      map((arr) => this.success<T>(arr as T[])),
      catchError((err) => of(this.fail<T>(err.message ?? 'Realtime Firestore multiWhere error')))
    );
  }
}
