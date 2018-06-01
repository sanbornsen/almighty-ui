  import { cloneDeep } from 'lodash';
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
import { pipe } from 'rxjs';

export type Action = IterationActions.All;

export const iterationReducer: ActionReducer<IterationState> =
  ( state = initialState, action: Action) => {
    switch( action.type ) {
      case IterationActions.GET_SUCCESS:
        return action.payload

      case IterationActions.ADD_SUCCESS:
        const parent = action.payload.parent;
        const newIterationId = action.payload.iteration.id;
        if (parent) {
          // const parentIndex = state.findIndex(i => i.id === parent.id);
          // if (parentIndex > -1) {
          //   state[parentIndex].hasChildren = true;
          // }
          state[parent.id].hasChildren = true
          // if(state[parent.id].children) {
          //   state[parent.id].children = [
          //     action.payload.iteration,
          //     ...state[parent.id].children
          //   ];
          // } else {
          //   state[parent.id].children = [
          //     action.payload.iteration
          //   ];
          // }
        }
        return { newIterationId: action.payload.iteration, ...state} ;

      case IterationActions.UPDATE_SUCCESS:
        const updatedIterationid = action.payload.id;
        // for(let key in state) {
        //   if(state[key].parentId === updatedIteration.id)
        //     updatedIteration.children = [state[key], ...updatedIteration.children];
        // }          
        // const index = state.findIndex(i => i.id === updatedIteration.id);
        // if (index > -1) {
        //   updatedIteration.selected = state[index].selected;
        //   state = [
        //     ...state.slice(0, index),
        //     updatedIteration,
        //     ...state.slice(index + 1)
        //   ]
        //   const parentIndex = state.findIndex(i => i.id === updatedIteration.parentId);
        //   if (parentIndex > -1 && state[parentIndex].children) {
        //     const childIndex =
        //       state[parentIndex].children.findIndex(i => i.id === updatedIteration.id);
        //     if (childIndex > -1) {
        //       state[parentIndex].children = [
        //         ...state[parentIndex].children.slice(0, childIndex),
        //         state[index],
        //         ...state[parentIndex].children.slice(childIndex + 1)
        //       ]
        //     }
        //   }
        // }
        action.payload.selected = state[updatedIterationid].selected
        state[updatedIterationid] = action.payload
        return {...state};

      case IterationActions.SELECT:
        if (action.payload !== null) {
          // const itIndex = state.findIndex(
          //   item => item.id === action.payload.id
          // );
          // if (itIndex > -1) {
          //   for(let i = 0; i < state.length; i++) {
          //     state[i].selected = i === itIndex;
          //   }
          // }
          state[action.payload].selected = true;
          // Expand all the parents
          // let pId = state[itIndex].parentId;
          let pId = state[action.payload].parentId;
          while(pId) {
            const pIndex = pId;
            if(state[pId]){
              state[pId].showChildren = true
              pId = state[pIndex].parentId;
            }
            // state.findIndex(
            //   item => item.id === pId
            // );
            // if (pIndex > -1) {
            //   state[pIndex].showChildren = true;
            //   pId = state[pIndex].parentId;
            // }
          }
        } else {
          for(let i in state) {
            state[i].selected = false;
            state[i].showChildren = false;
          }
        }
        return {...state}; // This is important for change detection

      case IterationActions.GET_ERROR:
        return state;

      case IterationActions.ADD_ERROR:
        return state;

      case IterationActions.UPDATE_ERROR:
        return state;

      default:
        return state;
    }
  }

export const iterationUiReducer: ActionReducer<IterationUIState> =
  ( s = initialUIState, action: Action) => {
    const state = cloneDeep(s);
    switch( action.type ) {
      case IterationActions.UPDATE_SUCCESS:
      case IterationActions.ADD_SUCCESS:
        state.error = '';
        state.modalLoading = false;
        return state;

      case IterationActions.UPDATE:
      case IterationActions.ADD:
        state.error = '';
        state.modalLoading = true;
        return state;

      case IterationActions.ADD_ERROR:
        state.modalLoading = false;
        state.error = 'Some error has occured on adding iteration';
        return state;

      case IterationActions.UPDATE_ERROR:
        state.modalLoading = false;
        state.error = 'Some error has occured on updating iteration';
        return state;

      default:
        return state;
    }
  }
