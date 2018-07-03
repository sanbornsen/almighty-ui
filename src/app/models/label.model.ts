import { Injectable } from '@angular/core';
import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { LabelService as LabelDataService } from './../services/label.service';
import { AppState, PlannerState } from './../states/app.state';
import {
  Mapper,
  MapTree,
  modelService,
  modelUI,
  switchModel
} from './common.model';

const labelAdapter = createEntityAdapter<LabelUI>();
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = labelAdapter.getSelectors();

export class LabelModel extends modelService {
  attributes: LabelAttributes;
  links?: LabelLinks;
  relationships?: LabelRelationships;
}

export class LabelAttributes {
  'background-color'?: string;
  'border-color'?: string;
  'created-at'?: string;
  name: string;
  'text-color'?: string;
  'updated-at'?: string;
  version?: number;
}

export class LabelLinks {
  related: string;
  self: string;
}

export class LabelRelationships {
  space: {
    data: {
      id: string;
      type: string;
    }
    links: {
      related: string;
      self: string;
    }
  };
}

export interface LabelService extends LabelModel {}

export interface LabelUI extends modelUI {
  version: number;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export class LabelMapper implements Mapper<LabelService, LabelUI> {

  serviceToUiMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['attributes', 'name'],
      toPath: ['name']
    }, {
      fromPath: ['attributes', 'background-color'],
      toPath: ['backgroundColor']
    }, {
      fromPath: ['attributes', 'version'],
      toPath: ['version']
    }, {
      fromPath: ['attributes', 'border-color'],
      toPath: ['borderColor']
    }, {
      fromPath: ['attributes', 'text-color'],
      toPath: ['textColor']
    }
  ];

  uiToServiceMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['name'],
      toPath: ['attributes', 'name']
    }, {
      fromPath: ['backgroundColor'],
      toPath: ['attributes', 'background-color']
    }, {
      fromPath: ['version'],
      toPath: ['attributes', 'version']
    }, {
      fromPath: ['borderColor'],
      toPath: ['attributes', 'border-color']
    }, {
      fromPath: ['textColor'],
      toPath: ['attributes', 'text-color']
    }, {
      toPath: ['type'],
      toValue: 'labels'
    }
  ];

  toUIModel(arg: LabelService): LabelUI {
    return switchModel<LabelService, LabelUI>(
      arg, this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: LabelUI): LabelService {
    return switchModel<LabelUI, LabelService>(
      arg, this.uiToServiceMapTree
    );
  }
}

@Injectable()
export class LabelQuery {
  constructor(
    private store: Store<AppState>
  ) {}

  private plannerSelector = createFeatureSelector<PlannerState>('planner');
  private labelSelector = createSelector(
    this.plannerSelector,
    state => state.labels
  );
  private getAllLabelsSelector = createSelector(
    this.labelSelector,
    selectAll
  );
  private getLabelEntities = createSelector(
    this.labelSelector,
    selectEntities
  );

  getLables(): Store<LabelUI[]> {
    return this.store.select(this.getAllLabelsSelector);
  }

  getLabelObservableById(number: string): Store<LabelUI> {
    const labelSelector = createSelector(
      this.getLabelEntities,
      state => state[number]
    );
    return this.store.select(labelSelector);
  }

  getLabelObservablesByIds(ids: string[]): Observable<LabelUI[]> {
    if (!ids.length) { return Observable.of([]); }
    return Observable.combineLatest(ids.map(id => this.getLabelObservableById(id)))
      // If the label is not available in the state
      // it comes as undefined so we filter them out
      .map(labels => labels.filter(l => !!l))
      // In case the combine operation is stuck for any single
      // observable inside, we start the stream with an empty array
      .startWith([]);
  }
}
