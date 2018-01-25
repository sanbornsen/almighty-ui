import { State, ActionReducer } from '@ngrx/store';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemState, initialState } from './../states/work-item.state';
import { cloneDeep } from 'lodash';

import { WorkItemUI } from './../models/work-item';

export type Action = WorkItemActions.All;

export const WorkItemReducer: ActionReducer<WorkItemState> = (state = initialState, action: Action) => {
  switch(action.type) {
    case WorkItemActions.GET_SUCCESS: {
      return  cloneDeep(action.payload);
    }
    case WorkItemActions.GET_ERROR: {
      return state;
    }
    case WorkItemActions.ADD_SUCCESS: {
      return state = [...[action.payload], ...state];
    }
    case WorkItemActions.ADD_ERROR: {
      return state;
    }
    case WorkItemActions.UPDATE_SUCCESS: {
      let updatedWorkItem = action.payload;
      let index = state.findIndex(wi => wi.id === updatedWorkItem.id);
      if (index > -1) {
        state[index] = action.payload;
      }
      return state;
    }
    case WorkItemActions.UPDATE_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
}
