import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as WorkItemDetailActions from './../actions/work-item-detail.actions';
import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import { AppState } from './../states/app.state';
import { WorkItemMapper } from "../models/work-item";

export type Action = WorkItemDetailActions.All;

@Injectable()
export class WorkItemDetailEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>
  ){}

  @Effect() getWorkItemByNumber$: Observable<Action> = this.actions$
    .ofType<WorkItemDetailActions.GetWorkItemByNumber>(WorkItemDetailActions.GET)
    .switchMap(action => {
      return this.workItemService.getWorkItemByNumber(action.id, action.owner, action.space)
      .map(wi => {
         const wiMapper = new WorkItemMapper();
         return wiMapper.toUIModel(wi);
      })
      .map(wi => (new WorkItemDetailActions.GetSuccess(wi)))
      .catch(() => Observable.of(new WorkItemDetailActions.GetError()))
    })
}
