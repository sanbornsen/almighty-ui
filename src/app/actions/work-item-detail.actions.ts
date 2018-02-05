import { Action } from '@ngrx/store';
import {
  WorkItemTypeUI,
} from './../models/work-item-type';

export const GET = '[wi-detail] Get';
export const GET_SUCCESS = '[wi-detail] GetSuccess';
export const GET_ERROR = '[wi-detail] GetError';

export class GetWorkItemByNumber implements Action {
  id: string;
  owner = '';
  space = '';
  constructor(id: string, owner: string, space: string){
      this.id = id;
      this.owner = owner;
      this.space = space;
  }
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: WorkItemTypeUI[];
  constructor(payload: WorkItemTypeUI[]) {
    this.payload = payload;
  };
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All
  = GetWorkItemByNumber
  | GetSuccess
  | GetError
