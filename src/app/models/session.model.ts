export interface Session {
  id: string;
  title: string;
  teacher: string;
  startAt: string; // ISO string
  seatsTotal: number;
  seatsLeft: number;
  meetingLink?: string;
}

//NEw

interface SessionNew {
  title: string;
  subject: string;
  teacherId: string;
  studentIds: string[];
  startTime: Date;
  endTime: Date;
  meetLink: string;
  status: 'upcoming' | 'live' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
