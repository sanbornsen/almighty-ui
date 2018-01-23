import { IterationUI } from './../models/iteration.model';

export type IterationState = IterationUI[];

export const initialState: IterationState = [] as IterationState;

export interface IterationUIState {
  loading: boolean;
  error: string;
  success: string;
}

export const initialUIState: IterationUIState = {
  loading: false,
  error: '',
  success: ''
}