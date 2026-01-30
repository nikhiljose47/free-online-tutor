import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

export type UsersByCodeResponse = {
  code: string;
  page: number;
  limit: number;
  totalUsers: number;
  users: string[];
};

type QueryKey = string;

@Injectable({ providedIn: 'root' })
export class AttendanceApiService {
  private readonly api = environment.attendanceApiBaseUrl; // e.g. https://user-attendance...workers.dev

  // ----- UI State (Signals) -----
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly data = signal<UsersByCodeResponse | null>(null);

  // ----- Simple Memo Cache (per code+page+limit) -----
  private cache = new Map<QueryKey, UsersByCodeResponse>();

  constructor(private http: HttpClient) {}

  // ----- Public API -----
  fetchUsersByCode(code: string, page = 1, limit = 20): void {
    const key = this.key(code, page, limit);

    // serve from cache instantly
    const cached = this.cache.get(key);
    if (cached) {
      this.data.set(cached);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams().set('code', code).set('page', page).set('limit', limit);

    this.http.get<UsersByCodeResponse>(`${this.api}/users`, { params }).subscribe({
      next: (res) => {
        this.cache.set(key, res);
        this.data.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load');
        this.loading.set(false);
      },
    });
  }
  
  getUsersBySubjectCode(code: string, page = 1, limit = 100) {
    return this.http.get<{
      users: string[];
      totalUsers: number;
    }>(`${this.api}/users`, {
      params: {
        code,
        page,
        limit,
      },
    });
  }

  // ----- Derived State -----
  readonly users = computed(() => this.data()?.users ?? []);
  readonly totalUsers = computed(() => this.data()?.totalUsers ?? 0);
  readonly page = computed(() => this.data()?.page ?? 1);
  readonly limit = computed(() => this.data()?.limit ?? 20);

  // ----- Helpers -----
  private key(code: string, page: number, limit: number): QueryKey {
    return `${code}|${page}|${limit}`;
  }

  hasAttendedToday(userId: string, code: string) {
    return this.http.get<{ attended: boolean }>(`${this.api}/has-attended`, {
      params: { userId, code },
    });
  }

  markAttendanceOnce(userId: string, code: string) {
    return this.http.post<{ alreadyMarked: boolean }>(this.api, { userId, code });
  }

  clearAttendanceAdmin(adminKey: string) {
    return this.http.delete<{ cleared: boolean }>(this.api, {
      headers: {
        'x-admin-key': adminKey,
      },
    });
  }
  // Optional: clear cache (e.g., on logout)
  clearCache(): void {
    this.cache.clear();
  }
}
