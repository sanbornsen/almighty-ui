import {
  Mapper,
  MapTree,
  switchModel,
  modelService
} from './common.model';
import { AppState } from './../states/app.state';
import { UserUI, UserQuery } from './user';
import { IterationUI, IterationModel, IterationQuery } from './iteration.model';
import { AreaUI, AreaModel, AreaQuery } from './area.model';
import { LabelUI, LabelModel, LabelQuery } from './label.model';
import { UserService } from 'ngx-login-client';
import { cloneDeep } from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


export class Event extends modelService {
  attributes: EventAttributes;
  relationships: EventRelationships;

}

export class EventAttributes {
  name: string;
  newValue: string | null;
  oldValue: string | null;
  timestamp: string;
}

export class EventRelationships {
  modifier: {
    data: {
      id: string;
      links: {
        related: string;
      }
      type: string;
    }
  }
  newValue?: {
    data?: AreaModel[] | IterationModel[] | UserService[] | LabelModel[];
  }
  oldValue?: {
    data?: AreaModel[] | IterationModel[] | UserService[] | LabelModel[];
  }
}

export interface EventUI {
  name: string;
  timestamp: string;
  newValue: string | null;
  oldValue: string | null;
  modifierId: string;
  modifier?: Observable<UserUI>;
  newValueRelationships: any;
  oldValueRelationships: any;
  newValueRelationshipsObs?: Observable<IterationUI | AreaUI | UserUI>[] | Observable<LabelUI[]>;
  oldValueRelationshipsObs?: Observable<IterationUI | AreaUI | UserUI>[] | Observable<LabelUI[]>;
  type: string | null;
}

export interface EventService extends Event { }

export class EventMapper implements Mapper<EventService, EventUI> {
  constructor() { }

  serviceToUiMapTree: MapTree = [{
    fromPath: ['attributes', 'name'],
    toPath: ['name']
  }, {
    fromPath: ['attributes', 'newValue'],
    toPath: ['newValue']
  }, {
    fromPath: ['attributes', 'oldValue'],
    toPath: ['oldValue']
  }, {
    fromPath: ['attributes', 'timestamp'],
    toPath: ['timestamp']
  }, {
    fromPath: ['relationships', 'modifier', 'data', 'id'],
    toPath: ['modifierId']
  }, {
    fromPath: ['relationships', 'newValue'],
    toPath: ['newValueRelationships'],
    toFunction: (newValue) => {
      if (newValue !== null) {
        if(newValue.hasOwnProperty('data')){
          return newValue["data"].map(item => {
            return {
              id: item.id,
              type: item.type
            }
          })
        }else
          return [];
      } else {
        return newValue
      }
    }
  }, {
    fromPath: ['relationships', 'oldValue'],
    toPath: ['oldValueRelationships'],
    toFunction: (oldValue) => {
        if (oldValue !== null) {
        if(oldValue.hasOwnProperty('data'))
          return oldValue["data"].map(item => {
            return {
              id: item.id,
              type: item.type
            }
          })
        else
          return [];
      } else {
        return oldValue
      }
    }
  }, {
    toPath: ['type'],
    toValue: null
  },];
  uiToServiceMapTree: MapTree;

  toUIModel(arg: EventService): EventUI {
    return switchModel<EventService, EventUI>(
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: EventUI): EventService {
    return switchModel<EventUI, EventService>(
      arg, this.uiToServiceMapTree
    )
  }
}

@Injectable()
export class EventQuery {
  private eventSource = this.store
    .select(state => state.detailPage)
    .select(state => state.events);

  constructor(
    private store: Store<AppState>,
    private userQuery: UserQuery,
    private iterationQuery: IterationQuery,
    private areaQuery: AreaQuery,
    private labelQuery: LabelQuery
  ) { }

  getEventsWithModifier(): Observable<EventUI[]> {
    return this.eventSource
      .map(events => {
        return events.map(event => {
          switch(event.name) {
            case 'system.iteration':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs: event.newValueRelationships.map(item => {
                  return this.iterationQuery.getIterationObservableById(item.id);
                }),
                oldValueRelationshipsObs: event.oldValueRelationships.map(item => {
                  return this.iterationQuery.getIterationObservableById(item.id);
                })
              }
            case 'system.area':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs: event.newValueRelationships.map(item => {
                  return this.areaQuery.getAreaObservableById(item.id);
                }),
                oldValueRelationshipsObs: event.oldValueRelationships.map(item => {
                  return this.areaQuery.getAreaObservableById(item.id);
                })
              }
            case 'system.assignees':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs: event.newValueRelationships.map(item => {
                  return this.userQuery.getUserObservableById(item.id);
                }),
                oldValueRelationshipsObs: event.oldValueRelationships.map(item => {
                  return this.userQuery.getUserObservableById(item.id);
                })
              }

            case 'system.labels':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs:
                  this.labelQuery.getLabelObservablesByIds(
                    event.newValueRelationships.map(i => i.id)
                  ),
                oldValueRelationshipsObs:
                  this.labelQuery.getLabelObservablesByIds(
                    event.oldValueRelationships.map(i => i.id)
                  )
              }

            default:
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId)
              }
          }
        })
      })
  }
}
