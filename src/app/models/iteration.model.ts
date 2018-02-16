import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel
} from './common.model';

export class IterationModel extends modelService {
  attributes?: IterationAttributes;
  links?: IterationLinks;
  relationships?: IterationRelations;
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

export interface IterationService extends IterationModel {};

export interface IterationUI extends modelUI {
  parentPath: string; // attributes / parent_path
  resolvedParentPath: string; // attributes / resolved_parent_path
  userActive: boolean; // attributes / user_active
  isActive: boolean; // attributes / active_status
  startAt: string; // attributes / startAt
  endAt: string; // attributes / startAt
  description: string; // attributes / description
  state: string;
  link: string;
  workItemTotalCount: number;
  workItemClosedCount: number;
  children: IterationUI[];
  hasChildren?: boolean;
  parentId?: string; // relationships / parent / data / id
  selected: boolean;
  showChildren: boolean;
}

export class IterationMapper implements Mapper<IterationModel, IterationUI> {

  serviceToUiMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['attributes','name'],
      toPath: ['name']
    }, {
      fromPath: ['attributes','parent_path'],
      toPath: ['parentPath']
    }, {
      fromPath: ['attributes','resolved_parent_path'],
      toPath: ['resolvedParentPath']
    }, {
      fromPath: ['attributes','user_active'],
      toPath: ['userActive']
    }, {
      fromPath: ['attributes','active_status'],
      toPath: ['isActive']
    }, {
      fromPath: ['attributes','startAt'],
      toPath: ['startAt']
    }, {
      fromPath: ['attributes','endAt'],
      toPath: ['endAt']
    }, {
      fromPath: ['attributes','description'],
      toPath: ['description']
    }, {
      fromPath: ['attributes','state'],
      toPath: ['state']
    }, {
      fromPath: ['links','self'],
      toPath: ['link']
    }, {
      fromPath: ['relationships','workitems','meta','total'],
      toPath: ['workItemTotalCount']
    }, {
      fromPath: ['relationships','workitems','meta','closed'],
      toPath: ['workItemClosedCount']
    }, {
      fromPath: ['hasChildren'],
      toPath: ['hasChildren']
    }, {
      fromPath: ['relationships', 'parent', 'data', 'id'],
      toPath: ['parentId']
    }, {
      toPath: ['selected'],
      toValue: false
    }, {
      toPath: ['showChildren'],
      toValue: false
    }

  ];

  uiToServiceMapTree: MapTree = [{
      fromPath: ['id'],
      toPath: ['id']
    }, {
      fromPath: ['name'],
      toPath: ['attributes','name'],
    }, {
      fromPath: ['parentPath'],
      toPath: ['attributes','parent_path'],
    }, {
      fromPath: ['resolvedParentPath'],      
      toPath: ['attributes','resolved_parent_path'],
    }, {
      fromPath: ['userActive'],      
      toPath: ['attributes','user_active'],
    }, {
      fromPath: ['isActive'],
      toPath: ['attributes','active_status'],
    }, {
      fromPath: ['startAt'],
      toPath: ['attributes','startAt'],
    }, {
      fromPath: ['endAt'],      
      toPath: ['attributes','endAt'],
    }, {
      fromPath: ['description'],
      toPath: ['attributes','description'],
    }, {
      fromPath: ['state'],
      toPath: ['attributes','state'],
    }, {
      fromPath: ['link'],
      toPath: ['links','self'],
    }, {      
      fromPath: ['workItemTotalCount'],
      toPath: ['relationships','workitems','meta','total'],
    }, {
      fromPath: ['workItemClosedCount'],      
      toPath: ['relationships','workitems','meta','closed'],
    }, {
      fromPath: ['hasChildren'],
      toPath: ['hasChildren']
    }, {
      fromPath: ['parentId'],      
      toPath: ['relationships', 'parent', 'data', 'id'],
    }, {
      toPath: ['relationships', 'parent', 'data', 'type'],
      toValue: 'iterations'
    }, {
      toPath: ['type'],
      toValue: 'iterations'
    }
  ];

  toUIModel(arg: IterationService): IterationUI {
    return switchModel<IterationService, IterationUI>(
      arg, this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: IterationUI): IterationService {
    return switchModel<IterationUI, IterationService>(
      arg, this.uiToServiceMapTree
    );
  }
}
