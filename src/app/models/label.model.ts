import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel
} from './common.model';
import { Injectable } from '@angular/core';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { LabelService as LabelDataService } from './../services/label.service';
import { AppState, ListPage } from './../states/app.state';

export class LabelModel extends modelService {
  attributes: LabelAttributes;
  links?: LabelLinks;
  relationships?: LabelRelationships;
}

export class LabelAttributes {
  "background-color"?: string;
  "border-color"?: string;
  "created-at"?: string;
  name: string;
  "text-color"?: string;
  "updated-at"?: string;
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
  }
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
      fromPath: ['attributes','name'],
      toPath: ['name']
    }, {
      fromPath: ['attributes','background-color'],
      toPath: ['backgroundColor']
    }, {
      fromPath: ['attributes','version'],
      toPath: ['version']
    }, {
      fromPath: ['attributes','border-color'],
      toPath: ['borderColor']
    }, {
      fromPath: ['attributes','text-color'],
      toPath: ['textColor']
    }
  ];

  uiToServiceMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['name'],
      toPath: ['attributes','name'],
    }, {
      fromPath: ['backgroundColor'],
      toPath: ['attributes','background-color'],
    }, {
      fromPath: ['version'],
      toPath: ['attributes','version'],
    }, {
      fromPath: ['borderColor'],
      toPath: ['attributes','border-color'],
    }, {
      fromPath: ['textColor'],
      toPath: ['attributes','text-color'],
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
    private store: Store<AppState>,
    private labelService: LabelDataService
  ){}

  private listPageSelector = createFeatureSelector<ListPage>('listPage');
  private labelSelector = createSelector(
    this.listPageSelector,
    (state) => state.labels
  );
  private labelSource = this.store.select(this.labelSelector);

  getLables(): Store<LabelUI[]> {
    return this.labelSource;
  }
}
