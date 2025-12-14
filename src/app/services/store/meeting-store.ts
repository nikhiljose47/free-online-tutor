// import { Injectable, signal, computed, effect } from '@angular/core';
// import { Meeting, MeetingsService } from '../../domain/meetings/meetings.service';
// import { map, of, tap } from 'rxjs';

// export interface GroupedMeetings {
//   live: Meeting[];
//   upcoming: Meeting[];
//   completed: Meeting[];
// }

// @Injectable({ providedIn: 'root' })
// export class MeetingStore {
//   private meetings = signal<Record<string, Meeting[]>>({}); // classId → meetings[]

//   constructor(private meetingApi: MeetingsService) {}

//   loadClassMeetings(classId: string) {
//     const cached = this.meetings()[classId];

//     if (cached) {
//       return of({ ok: true, data: cached, message: null });
//     }

//     return this.meetingApi.getMeetingsForClass(classId).pipe(
//       tap((res) => {
//         if (res.ok && res.data) {
//           this.meetings.update((m) => ({
//             ...m,
//             [classId]: res.data!,
//           }));
//         }
//       }),
//       map((res) => ({
//         ok: res.ok,
//         data: res.data ?? null
//       }))
//     );
//   }

//   // 🔥 Get raw meetings for a class (reactive)
//   meetingsFor(classId: string) {
//     return computed(() => this.meetings()[classId] ?? []);
//   }

//   // 🔥 Auto-group meetings (LIVE / UPCOMING / COMPLETED)
//   groupedFor(classId: string) {
//     const now = new Date();

//     return computed<GroupedMeetings>(() => {
//       const items = this.meetings()[classId] ?? [];

//       const live = items.filter((m) => this.isLive(m.date.toDate(), now));

//       const upcoming = items.filter((m) => this.isUpcoming(m.date.toDate(), now));

//       const completed = items.filter((m) => this.isCompleted(m.date.toDate(), now));

//       return { live, upcoming, completed };
//     });
//   }

//   // ------------- Classification Helpers -------------

//   private isLive(date: Date, now: Date) {
//     const start = new Date(date.getTime());
//     const end = new Date(date.getTime() + 40 * 60 * 1000); // live for 40 min
//     return now >= start && now <= end;
//   }

//   private isUpcoming(date: Date, now: Date) {
//     return date > now; // future meetings
//   }

//   private isCompleted(date: Date, now: Date) {
//     return date < now; // past meetings
//   }
// }
