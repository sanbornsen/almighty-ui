import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs";
import * as IterationActions from ".././actions/iteration.actions";
import { IterationService } from '.././services/iteration.service';
import { IterationMapper } from '.././models/iteration.model';

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
           .do(iterations=> { 
                              let iterationMapper: IterationMapper;
                              return iterationMapper.IterationModeltoIterationUI(iterations)
                            }
            )
           .map(iterations => (new IterationActions.GetSuccess(iterations)))
           .catch(() => Observable.of(new IterationActions.GetError()))
    });
}
