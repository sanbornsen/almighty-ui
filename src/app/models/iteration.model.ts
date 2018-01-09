import { modelUI } from './common.model';

export class IterationModel {
  attributes?: IterationAttributes;
  id: string;
  links?: IterationLinks;
  relationships?: IterationRelations;
  type: string;
  hasChildren?: boolean;
  children?: IterationModel[];
}

export class IterationAttributes {
  user_active?: boolean;
  active_status?: boolean;
  endAt?: string;
  startAt?: string;
  name: string;
  state: string;
  description?: string;
  parent_path: string;
  resolved_parent_path?: string;
}

export class IterationLinks {
  self: string;
}

export class IterationRelations {
  parent?: {
    data: {
      id: string,
      type: string
    },
    links: {
      self: string
    }
  };
  space: {
    data: {
      id: string;
      type: string;
    };
    links: {
      self: string;
    };
  };
  workitems: {
    links: {
      related: string;
    };
    meta: {
      closed: number;
      total: number;
    };
  };
}

export interface IterationUI extends modelUI {
  parentPath: string;
  resolvedParentPath: string;
  userActive: boolean;
  activeStatus: boolean;
  startAt: string;
  endAt: string;
  description: string;
  state: string;
  links: string;
  workItemCount: number;

}

export class IterationMapper {
iterations: IterationModel[];
iteration: IterationModel;
iterationsUI: IterationUI[];
iterationUI: IterationUI;


IterationModeltoIterationUI(iterations: IterationModel[]): IterationUI[] {
  var i;
  for(i=0;i<iterations.length;i=i+1)
  {
    
    this.iterationsUI[i] = this._utilMapperUIModel(iterations[i]);
    
  }

  return this.iterationsUI;

}

_utilMapperUIModel(iterationModel: IterationModel): IterationUI {
    
    let iterationUI: IterationUI;
    iterationUI.id = iterationModel.id;
    iterationUI.name = iterationModel.attributes.name;
    iterationUI.parentPath = iterationModel.attributes.parent_path;
    iterationUI.resolvedParentPath = iterationModel.attributes.resolved_parent_path;
    iterationUI.userActive = iterationModel.attributes.user_active;
    iterationUI.activeStatus = iterationModel.attributes.active_status;
    iterationUI.startAt = iterationModel.attributes.startAt;
    iterationUI.endAt = iterationModel.attributes.endAt;
    iterationUI.description = iterationModel.attributes.description;
    iterationUI.state = iterationModel.attributes.state;
    iterationUI.links = iterationModel.links.self;
    iterationUI.workItemCount = iterationModel.relationships.workitems.meta.total;

    return iterationUI; 
  }

}