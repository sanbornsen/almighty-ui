import { GlobalSettings } from '../shared/globals';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


import { cloneDeep } from 'lodash';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { HttpService } from './http-service';

import { Space, Spaces } from 'ngx-fabric8-wit';
import { GroupTypesModel } from '../models/group-types.model';
import { WorkItem } from '../models/work-item'
import { WorkItemType } from '../models/work-item-type';
import { MockHttp } from '../mock/mock-http';

@Injectable()
export class GroupTypesService {
  private groupTypeResponse;
  public groupTypes: GroupTypesModel[] = [];
  private headers = new Headers({'Content-Type': 'application/json'});
  private _currentSpace;
  private selectedGroupType: GroupTypesModel;
  public groupTypeSelected: Subject<GroupTypesModel> = new Subject();
  public workItemSelected: Subject<GroupTypesModel> = new Subject();

  constructor(
    private logger: Logger,
    private http: HttpService,
    private auth: AuthenticationService,
    private globalSettings: GlobalSettings,
    private spaces: Spaces
  ) {
    this.spaces.current.subscribe(val => this._currentSpace = val);
  }

  getGroupTypes(): Observable<GroupTypesModel[]> {
    //this will change after integrating with API
    //For now use the mock data which resembles the api response
    this.mockData();
    if (this._currentSpace) {
      return Observable.of(this.groupTypes);
    } else {
      return Observable.of<GroupTypesModel[]>( [] as GroupTypesModel[] );;
    }
  }

  getFlatGroupList(): Observable<GroupTypesModel[]>{
    this.mockData();
    if (this._currentSpace) {
      //Normalize the response - we don't want two portfolio - that is
      //no two entries for the same level
      let wi_collection = [];
      let groupTypes = cloneDeep(this.groupTypes);
      let returnResponse = groupTypes.filter((item, index) => {
        if(groupTypes[index+1]) {
          if( item.level[0] == groupTypes[index+1].level[0] ) {
            wi_collection = item.wit_collection;
          } else {
            item.wit_collection = [...item.wit_collection, ...wi_collection]
            wi_collection = [];
            return item;
          }
        } else {
          return item;
        }
      });
      return Observable.of(returnResponse);
    } else {
      return Observable.of<GroupTypesModel[]>( [] as GroupTypesModel[] );;
    }
  }

  setCurrentGroupType(groupType) {
    this.selectedGroupType = groupType;
    //emit observable. Listener on planner backlog view
    this.groupTypeSelected.next(groupType);
  }

  getAllowedChildWits(workItem: WorkItem) {
    //Get to the highest level
    //set sub level as child
    //If no sub level, get the next level as child
    let WITid = workItem.relationships.baseType.data.id;
    let groupType = this.groupTypes
        .find(groupType => groupType.wit_collection.indexOf(WITid) > -1);

    // grouptype is undefined when it's not find the WIT in the groupTypes JSON.
    if(groupType !== undefined) {
      let level = groupType.level[0];
      let subLevel = groupType.level[1];
      let guidedGroupType = this.groupTypes
          .find(groupType => groupType.level[0] === level + 1);
      if(subLevel === 0 && groupType.group === 'portfolio') {
        guidedGroupType = this.groupTypes
          .find(groupType => groupType.level[1] === subLevel + 1);
      }
      this.selectedGroupType = guidedGroupType;
      this.workItemSelected.next(guidedGroupType);
    }
  }

  mockData(): Array<GroupTypesModel> {
    //Map the json blob to what the UI needs
    this.groupTypeResponse = {
      "id":"f3423d58-ad28-427b-abf1-930afbb670c0",
      "type":"typehierarchies",
      "attributes":
      {
        "hierarchy":[
          {
            "level":[0, 0],
            "group":"portfolio",
            "name":"Portfolio",
            "wit_collection":[
              "71171e90-6d35-498f-a6a7-2083b5267c18",
              "ee7ca005-f81d-4eea-9b9b-1965df0988d0",
              "6d603ab4-7c5e-4c5f-bba8-a3ba9d370985"
            ]
          },
          {
            "level":[0, 1],
            "group":"portfolio",
            "name":"Portfolio",
            "wit_collection":[
              "b9a71831-c803-4f66-8774-4193fffd1311",
              "3194ab60-855b-4155-9005-9dce4a05f1eb"
            ]
          },
          {
            "level":[1, 0],
            "group":"requirements",
            "name":"Requirements",
            "wit_collection":[
              "0a24d3c2-e0a6-4686-8051-ec0ea1915a28",
              "26787039-b68f-4e28-8814-c2f93be1ef4e"
            ]
          }
        ]
      }
    }
    this.groupTypes = this.groupTypeResponse.attributes.hierarchy;
    return this.groupTypes;
  }
}
