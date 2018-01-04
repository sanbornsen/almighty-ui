import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs";
import * as IterationActions from ".././actions/iteration.actions";
import { IterationService } from '.././services/iteration.service';

export type Action = IterationActions.All;

@Injectable()
export class IterationEffects {
  constructor( private actions$ : Actions,
               private iterationService : IterationService ) {
  }

  @Effect() getIterations$ : Observable<Action> = this.actions$
    .ofType<IterationActions.Get>(IterationActions.GET)
    .switchMap(action => {
      return this.iterationService.getIterations()
           .map(iterations => (new IterationActions.GetSuccess(iterations)))
           .catch(() => Observable.of(new IterationActions.GetError()))
    });

  @Effect() addIteration$ : Observable<Action> = this.actions$
    .ofType<IterationActions.Add>(IterationActions.ADD)
    .switchMap(action => {
      console.log('####-9', action);
      return this.iterationService.createIteration(action.iteration,action.parentIteration)
           .map(iteration => (new IterationActions.AddSuccess(iteration)))
           .catch(() => Observable.of(new IterationActions.AddError()))
    });
  
  @Effect() updateIteration$ : Observable<Action> = this.actions$
    .ofType<IterationActions.Update>(IterationActions.UPDATE)
    .switchMap(action => {
      console.log('####-', action);
      return this.iterationService.updateIteration(action.iteration)
           .map(iteration => (new IterationActions.AddSuccess(iteration)))
           .catch(() => Observable.of(new IterationActions.AddError()))
    });
}

