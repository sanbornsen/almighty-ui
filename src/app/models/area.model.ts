import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel,
  CommonSelectorUI,
} from './common.model';
import { Injectable } from '@angular/core';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, ListPage } from '../states/app.state';
import { Observable } from 'rxjs';
import { WorkItem } from '../..';
import { WorkItemQuery } from './work-item';
export class AreaModel extends modelService {
  attributes?: AreaAttributes;
  links?: AreaLinks;
  relationships?: AreaRelations;
}

export class AreaAttributes {
  name: string;
  description?: string;
  parent_path: string;
  parent_path_resolved: string;
}

export class AreaLinks {
  related: string;
  self: string;
}

export class AreaRelations {
  space: {
    data: {
      id: string;
      type: string;
    },
    links: {
      self: string;
    }
  };
  workitems: {
    links: {
      related: string;
    };
  };
}

export interface AreaUI extends modelUI {
  parentPath: string;
  parentPathResolved: string;
}

export interface AreaService extends AreaModel {}

export class AreaMapper implements Mapper<AreaService, AreaUI> {

  serviceToUiMapTree: MapTree = [{
    fromPath: ['id'],
    toPath: ['id']
  }, {
    fromPath: ['attributes', 'name'],
    toPath: ['name']
  }, {
    fromPath: ['attributes', 'parent_path'],
    toPath: ['parentPath']
  }, {
    fromPath: ['attributes', 'parent_path_resolved'],
    toPath: ['parentPathResolved']
  }];

  uiToServiceMapTree: MapTree = [{
    toPath: ['id'],
    fromPath: ['id']
  }, {
    toPath: ['attributes', 'name'],
    fromPath: ['name']
  }, {
    toPath: ['attributes', 'parent_path'],
    fromPath: ['parentPath']
  }, {
    toPath: ['attributes', 'parent_path_resolved'],
    fromPath: ['parentPathResolved']
  }, {
    toPath: ['type'],
    toValue: 'areas'
  }];

  toUIModel(arg: AreaService): AreaUI {
    return switchModel<AreaService, AreaUI> (
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: AreaUI): AreaService {
    return switchModel<AreaUI, AreaService> (
      arg, this.uiToServiceMapTree
    )
  }
}

@Injectable()
export class AreaQuery {
  private listPageSelector = createFeatureSelector<ListPage>('listPage');
  private areaSelector = createSelector(
    this.listPageSelector,
    (state) => state.areas
  );
  private areaSource = this.store.select(this.areaSelector);

  constructor(private store: Store<AppState>,
    private workItemQuery: WorkItemQuery) {
  }

  getAreas(): Observable<AreaUI[]> {
    return this.areaSource.map(areas => {
      return Object.keys(areas).map(id => areas[id]);
    })
  }

  getAreaObservableById(id: string):Observable<AreaUI> {
    return this.areaSource.select(areas => areas[id]);
  }

  getAreasForWorkItem(number: string | number): Observable<CommonSelectorUI[]> {
    return this.workItemQuery.getWorkItem(number)
      .filter(w => !!w)
      .switchMap(workItem => {
        return this.getAreas()
          .map(areas => {
            return areas.map(area => {
              return {
                key: area.id,
                value: (area.parentPathResolved!='/'?area.parentPathResolved:'') + '/' + area.name,
                selected: area.id === workItem.areaId,
                cssLabelClass: undefined
              }
            })
          })
      })
  }
}
