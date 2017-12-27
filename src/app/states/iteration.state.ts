import { IterationModel } from './../models/iteration.model';

export interface IterationState {
  iterations : IterationModel[];
  newIteration : IterationModel;
};

export const initialState: IterationState = {
  iterations : [],
  newIteration : null
}
