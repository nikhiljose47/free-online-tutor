import { Timestamp } from '@angular/fire/firestore';

export type AnnouncementVisibility = 'students' | 'parents' | 'all';

export type AnnouncementType = 'info' | 'alert' | 'update';

export interface Announcement {
  id: string;
  classId: string;
  title: string | null;
  message: string;
  imageUrl: string | null;
  linkUrl: string | null;
  priority: number | null;
  type: AnnouncementType | null;
  visibility: AnnouncementVisibility;
  enabled: boolean;
  startsAt: Timestamp | null;
  expiresAt: Timestamp | null;
  createdAt: Timestamp;
  meta: Record<string, unknown> | null;
}
