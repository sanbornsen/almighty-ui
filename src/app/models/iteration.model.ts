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
  link: string;
  workItemCount: number;
  type: string;

}

export class IterationMapper {

  iterationModel: IterationModel;
  iterationUI: IterationUI[];


  toUIModel(iterations: IterationModel[]): IterationUI[] {

   for(let i=0; i<iterations.length; i=i+1)
   {
     this.iterationUI[i] = this._utilMapperUIModel(iterations[i]);
   }
   
   return this.iterationUI;

  }

  toServiceModel(iteration: IterationUI): IterationModel {
  
   this.iterationModel = this._utilMapperServiceModel(iteration);
   return this.iterationModel;

  }


  _utilMapperServiceModel(iteration: IterationUI): IterationModel {
   
   let iterationModel: IterationModel;
   iterationModel.attributes = {
                                  user_active: iteration.userActive,
                                  active_status: iteration.activeStatus,
                                  endAt: iteration.endAt,
                                  startAt: iteration.startAt,
                                  name: iteration.name,
                                  state: iteration.state,
                                  description: iteration.description,
                                  parent_path: iteration.parentPath,
                                  resolved_parent_path: iteration.resolvedParentPath
                                } as IterationAttributes;
   iterationModel.id = iteration.id;
   iterationModel.links.self = iteration.link;
   iterationModel.relationships.workitems.meta.total = iteration.workItemCount;
   iterationModel.type = iteration.type;

   return iterationModel;
  }

  _utilMapperUIModel(iterationModel: IterationModel): IterationUI {
    
    let iterationUI: IterationUI;
    iterationUI = {
                     id: iterationModel.id,
                     name: iterationModel.attributes.name,
                     parentPath: iterationModel.attributes.parent_path,
                     resolvedParentPath: iterationModel.attributes.resolved_parent_path,
                     userActive: iterationModel.attributes.user_active,
                     activeStatus: iterationModel.attributes.active_status,
                     startAt: iterationModel.attributes.startAt,
                     endAt: iterationModel.attributes.endAt,
                     description: iterationModel.attributes.description,
                     state: iterationModel.attributes.state,
                     link: iterationModel.links.self,
                     workItemCount: iterationModel.relationships.workitems.meta.total,
                     type: iterationModel.type
                  } as IterationUI

    return iterationUI; 
  }

}