import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Observable } from 'rxjs';
import * as CustomQueryActions from './../actions/custom-query.actions';
import { CustomQueryModel } from './../models/custom-query.model';
import {
  CustomQueryService
} from './../services/custom-query.service';
import { AppState } from './../states/app.state';

export type Action = CustomQueryActions.All;

@Injectable()
export class CustomQueryEffects {
  constructor(
    private actions$: Actions,
    private customQueryService: CustomQueryService,
    private store: Store<AppState>,
    private notifications: Notifications
  ) {}

  @Effect() GetCustomQueries$: Observable<Action> = this.actions$
    .ofType(CustomQueryActions.GET)
    .withLatestFrom(this.store.select('planner').select('space'))
    .switchMap(([action, space]) => {
      return this.customQueryService.getCustomQueries(
        space.links.self + '/queries'
      )
      .map((types: CustomQueryModel[]) => {
        types = types.map((t) => {
          t['selected'] = false;
          return t;
        });
        return new CustomQueryActions.GetSuccess(types);
      })
      .catch(e => {
        try {
          this.notifications.message({
            message: 'Problem in fetching custom queries.',
            type: NotificationType.DANGER
          } as Notification);
        } catch (e) {
          console.log('Problem in fetching custom queries');
        }
        return Observable.of(new CustomQueryActions.GetError());
      });
    });

  @Effect() addCustomQuery$ = this.actions$
    .ofType<CustomQueryActions.Add>(CustomQueryActions.ADD)
    .withLatestFrom(this.store.select('planner').select('space'))
    .switchMap(([action, space]) => {
      let payload = action.payload;
      return this.customQueryService.create(
        payload,
        space.links.self + '/queries'
      )
      .map(customQuery => {
        customQuery['selected'] = true;
        let customQueryName = customQuery.attributes.title;
        if (customQueryName.length > 15) {
          customQueryName = customQueryName.slice(0, 15) + '...';
        }
        return new CustomQueryActions.AddSuccess(customQuery);
      })
      .catch(() => {
        try {
          this.notifications.message({
            message: `There was some problem creating custom query.`,
            type: NotificationType.DANGER
          } as Notification);
        } catch (e) {
          console.log('There was some problem creating custom query.');
        }
        return Observable.of(new CustomQueryActions.AddError());
      });
    });

  @Effect() deleteCustomQuery = this.actions$
    .ofType<CustomQueryActions.Delete>(CustomQueryActions.DELETE)
    .withLatestFrom(this.store.select('planner').select('space'))
    .switchMap(([action, space]) => {
      return this.customQueryService.delete(
        space.links.self + '/queries/' + action.payload.id
      )
      .map(() => {
        return new CustomQueryActions.DeleteSuccess(action.payload);
      })
      .catch(() => {
        try {
          this.notifications.message({
            message: `There was some problem in deleting custom query`,
            type: NotificationType.DANGER
          } as Notification);
        } catch (e) {
          console.log('There was some problem in deleting custom query');
        }
        return Observable.of(new CustomQueryActions.DeleteError());
      });
    });

}
