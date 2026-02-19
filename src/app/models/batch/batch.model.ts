
export type ClassSubjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Batch {
  id: string;
  curBatches: string[];
}
