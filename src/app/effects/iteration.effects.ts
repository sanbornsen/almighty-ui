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
           .map(iterations => (new IterationActions.AddSuccess(iterations)))
           .catch(() => Observable.of(new IterationActions.AddError()))
    });
}
