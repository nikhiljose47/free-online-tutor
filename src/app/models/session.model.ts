export interface Session {
  id: string;
  title: string;
  teacher: string;
  startAt: string;   // ISO string
  seatsTotal: number;
  seatsLeft: number;
  meetingLink?: string;
}
