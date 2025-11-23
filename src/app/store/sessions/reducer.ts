import { createReducer, on } from '@ngrx/store';
import { Session } from '../../models/session.model';
import { loadSessionsSuccess, selectSession } from './action';

export interface SessionState {
  sessions: Session[];
  selectedId: string | null;
}

export const initialState: SessionState = {
  sessions: [],
  selectedId: null
};

export const sessionReducer = createReducer(
  initialState,
  on(loadSessionsSuccess, (state, { sessions }) => ({ ...state, sessions })),
  on(selectSession, (state, { id }) => ({ ...state, selectedId: id }))
);
