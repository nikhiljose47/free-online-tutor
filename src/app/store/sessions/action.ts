import { createAction, props } from '@ngrx/store';
import { Session } from '../../models/session.model';

export const loadSessions = createAction('[Sessions] Load');
export const loadSessionsSuccess = createAction('[Sessions] Load Success', props<{ sessions: Session[] }>());
export const selectSession = createAction('[Sessions] Select', props<{ id: string }>());
