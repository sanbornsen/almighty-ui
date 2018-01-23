import * as IterationActions from '.././actions/iteration.actions';
import { State } from '@ngrx/store';
import { IterationModel } from './../models/iteration.model';
import { ActionReducer } from '@ngrx/store';
import {
  IterationState,
  initialState,
  IterationUIState,
  initialUIState
} from './../states/iteration.state';

export type Action = IterationActions.All;


export const iterationReducer : ActionReducer<IterationState> =
  ( state = initialState, action: Action) => {
    switch( action.type ) {
      case IterationActions.GET_SUCCESS:
        return action.payload

      case IterationActions.ADD_SUCCESS:
        const parent = action.payload.parent;
        const newIteration = action.payload.iteration;
        if (parent) {
          const parentIndex = state.findIndex(i => i.id === parent.id);
          if (parentIndex) {
            state[parentIndex].hasChildren = true;
          }
        }
        return [ action.payload.iteration, ...state ];

      case IterationActions.GET_ERROR:

      case IterationActions.ADD_ERROR:

      case IterationActions.UPDATE_SUCCESS:

      case IterationActions.UPDATE_ERROR:

      default:
        return state;
    }
  }

export const iterationUiReducer: ActionReducer<IterationUIState> =
  ( state = initialUIState, action: Action) => {
    switch( action.type ) {
      case IterationActions.ADD_SUCCESS:
        return {
          loading: false,
          error: '',
          success: ''
        };
      case IterationActions.ADD_ERROR:
        return {
          loading: false,
          error: '',
          success: ''
        };
      case IterationActions.ADD:
        return {
          loading: true,
          error: '',
          success: ''
        };
      default:
        return state;
    }
  }
