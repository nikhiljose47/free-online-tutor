import { Timestamp } from '@angular/fire/firestore';

export type AnnouncementVisibility = 'students' | 'parents' | 'all';
export type AnnouncementStatus = 'active' | 'archived' | 'draft';

export interface ClassAnnouncement {
  announcementId: string;
  classId: string;

  title: string;
  message: string;
  attachments: string[];

  visibility: AnnouncementVisibility;
  status: AnnouncementStatus;

  createdBy: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
  expiresAt: Timestamp | null;

  viewCount: number;

  meta: Record<string, unknown>;
}
