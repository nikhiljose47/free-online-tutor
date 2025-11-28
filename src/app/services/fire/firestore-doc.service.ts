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
} from '@angular/fire/firestore';
import { from, map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreDocService {
  private db = inject(Firestore);

  // -------------------------
  // Helpers
  // -------------------------
  private success<T>(data?: T) {
    return { ok: true, data };
  }

  private error(message: string) {
    return { ok: false, message };
  }

  private handle<T>() {
    return catchError((e: any) => of(this.error(e.message ?? 'Unknown Firestore error')));
  }

  // -------------------------
  // References
  // -------------------------
  private col<T>(path: string) {
    return collection(this.db, path) as any;
  }

  private doc<T>(path: string, id: string) {
    return doc(this.db, `${path}/${id}`) as any;
  }

  // -------------------------
  // CRUD OPERATIONS
  // -------------------------

  /** CREATE or SET */
  set<T>(path: string, id: string, data: T) {
    return from(setDoc(this.doc<T>(path, id), data)).pipe(
      map(() => this.success()),
      this.handle()
    );
  }

  /** UPDATE */
  update<T>(path: string, id: string, data: Partial<T>) {
    return from(updateDoc(this.doc<T>(path, id), data as any)).pipe(
      map(() => this.success()),
      this.handle()
    );
  }

  /** DELETE */
  delete(path: string, id: string) {
    return from(deleteDoc(this.doc(path, id))).pipe(
      map(() => this.success()),
      this.handle()
    );
  }

  /** GET SINGLE (ONCE) */
  getOnce<T>(path: string, id: string) {
    return from(getDoc(this.doc<T>(path, id))).pipe(
      map((snap) =>
        snap.exists() ? this.success(snap.data() as T) : this.error('Document not found')
      ),
      this.handle()
    );
  }

  /** LISTEN TO DOCUMENT */
  listen<T>(path: string, id: string) {
    return docData(this.doc<T>(path, id), { idField: 'id' }).pipe(
      map((d) => this.success(d as T)),
      this.handle()
    );
  }

  /** GET ALL (ONCE) */
  getAllOnce<T>(path: string) {
    return from(getDocs(this.col<T>(path))).pipe(
      map((snap) => this.success(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) })))),
      this.handle()
    );
  }

  /** LISTEN TO COLLECTION */
  listenAll<T>(path: string) {
    return collectionData(this.col<T>(path), { idField: 'id' }).pipe(
      map((data) => this.success(data as T[])),
      this.handle()
    );
  }

  /** WHERE QUERY */
  where<T>(path: string, field: string, op: any, value: any, limitTo = 50) {
    const q = query(this.col<T>(path), where(field, op, value), limit(limitTo));

    return from(getDocs(q)).pipe(
      map((snap) => this.success(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) })))),
      this.handle()
    );
  }
}
