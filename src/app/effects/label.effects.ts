import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as LabelActions from './../actions/label.actions';
import { Observable } from 'rxjs';
import { LabelService } from './../services/label.service';
import { AppState } from './../states/app.state';
import { LabelMapper } from "../models/label.model";
export type Action = LabelActions.All;

@Injectable()
export class LabelEffects {
  constructor(
    private actions$: Actions,
    private labelService: LabelService,
    private store: Store<AppState>
  ){}

  @Effect() getLabels$: Observable<Action> = this.actions$
    .ofType(LabelActions.GET)
    .switchMap(action => {
      return this.labelService.getLabels()
      .map(labels => {
         const lMapper = new LabelMapper();
         return labels.map(l => lMapper.toUIModel(l));
      })
      .map(labels => (new LabelActions.GetSuccess(labels)))
      .catch(() => Observable.of(new LabelActions.GetError()))
    })

  @Effect() createLabel$ = this.actions$
    .ofType<LabelActions.Add>(LabelActions.ADD)
    .switchMap(action => {
      const lMapper = new LabelMapper();
      return this.labelService.createLabel(lMapper.toServiceModel(action.payload))
      .map(label => (new LabelActions.AddSuccess(lMapper.toUIModel(label))))
      .catch(() => Observable.of(new LabelActions.AddError()))
    })
}
