import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Injectable, Inject } from '@angular/core';

@Injectable()
export class EventService {

  // For list page to change the list mode
  public showHierarchyListSubject = new BehaviorSubject<boolean>(true); // By default the list mode is true
  public workItemListReloadOnLink = new BehaviorSubject<boolean>(true); // The value is always true, this is just to trigger the list update

  constructor() {}

}
