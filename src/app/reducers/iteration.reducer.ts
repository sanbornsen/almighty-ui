import * as IterationActions from '.././actions/iteration.actions';
import { State } from '@ngrx/store';
import { IterationModel } from './../models/iteration.model';
import { ActionReducer } from '@ngrx/store';
import { IterationState, initialState } from './../states/iteration.state';

export type Action = IterationActions.All;


export const iterationReducer : ActionReducer<IterationState> = ( state = initialState, action: Action) =>
{
    
    switch( action.type ) {
      case IterationActions.GET_SUCCESS:
      console.log('####-3', action);
           return {
               iterations : action.payload,
               newIteration : state.newIteration
           }

      case IterationActions.GET_ERROR: 
            return state;

      case IterationActions.ADD_SUCCESS:
      console.log('####-10', action);
           var allIterations = state.iterations;
           var iteration = action.payload;
           console.log("####-11");
           console.log(allIterations);
           console.log(iteration);
           
           let index = allIterations.findIndex((it) => it.id === iteration.id);
             if (index >= 0) {
                 allIterations[index] = action.payload;
                 //if iteration is a child iteration update that content
                 let parent = this.iterationService.getDirectParent(iteration,allIterations);
                 if( parent != undefined ) {
                 let parentIndex = allIterations.findIndex(i => i.id === parent.id);
                 let childIndex = allIterations[parentIndex].children.findIndex(child => child.id === iteration.id);
                 allIterations[parentIndex].children[childIndex] = iteration;
                }
           } else {
            allIterations.splice(allIterations.length, 0, iteration);
            //Check if the new iteration has a parent
            if (!this.iterationService.isTopLevelIteration(iteration)) {
              let parent = this.iterationService.getDirectParent(iteration, allIterations);
              let parentIndex = allIterations.findIndex(i => i.id === parent.id);
              if(!allIterations[parentIndex].children) {
                allIterations[parentIndex].children = [];
                allIterations[parentIndex].hasChildren = true;
              }
              allIterations[parentIndex].children.push(iteration);
            }
            let childIterations = this.iterationService.checkForChildIterations(iteration, allIterations);
            if(childIterations.length > 0) {
              allIterations[allIterations.length].hasChildren = true;
              allIterations[allIterations.length].children = childIterations;
            }
          }
          
             return {
                 iterations : allIterations,
                 newIteration : iteration
             }
           

      case IterationActions.ADD_ERROR:
             return state;
      
      default:
          return state;
    }
  }
