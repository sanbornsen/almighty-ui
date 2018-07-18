import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { cloneDeep, sortBy } from 'lodash';
import {
  AuthenticationService
} from 'ngx-login-client';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { Observable } from 'rxjs/Observable';
import { WorkItemTypeUI } from '../../models/work-item-type';
import { IterationQuery, IterationUI } from './../../models/iteration.model';
import { CookieService } from './../../services/cookie.service';
import { FilterService } from './../../services/filter.service';
import { UrlService } from './../../services/url.service';
import { PlannerLayoutComponent } from './../../widgets/planner-layout/planner-layout.component';

// import for column
import { datatableColumn } from './datatable-config';

// ngrx stuff
import { Store } from '@ngrx/store';
import * as AreaActions from './../../actions/area.actions';
import * as CollaboratorActions from './../../actions/collaborator.actions';
import * as SpaceActions from './../../actions/space.actions';
import * as WorkItemActions from './../../actions/work-item.actions';
import { AreaQuery } from './../../models/area.model';
import { cleanObject } from './../../models/common.model';
import { GroupTypeQuery } from './../../models/group-types.model';
import { LabelQuery } from './../../models/label.model';
import { UserQuery } from './../../models/user';
import { WorkItemQuery, WorkItemUI } from './../../models/work-item';
import { AppState } from './../../states/app.state';
import { WorkItemPreviewPanelComponent } from './../work-item-preview-panel/work-item-preview-panel.component';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})

export class PlannerListComponent implements OnInit, OnDestroy, AfterViewChecked {
  private uiLockedAll: boolean = false;
  private sidePanelOpen: boolean = true;
  private workItemTypeSource = this.store
    .select('planner')
    .select('workItemTypes')
    .filter(w => !!w.length);
  private spaceSource = this.store
    .select('planner')
    .select('space')
    .do(s => {if (!s) { this.store.dispatch(new SpaceActions.Get()); }})
    .filter(s => !!s);
  private areaSource = this.areaQuery.getAreas()
    .filter(a => !!a.length);
  private labelSource = this.labelQuery.getLables();
  private iterationSource = this.iterationQuery.getIterations()
    .filter(i => !!i.length);
  private selectedIterationSource = this.iterationQuery.getSelectedIteration()
    .filter(i => i !== null);
  private collaboratorSource = this.userQuery.getCollaborators();
  private workItemSource = this.workItemQuery.getWorkItems();
  private routeSource = this.route.queryParams
    .filter(p => p.hasOwnProperty('q'));
  private quickAddWorkItemTypes: WorkItemTypeUI[] = [];
  private allWorkItemTypes: WorkItemTypeUI[] = [];
  private selectedIteration: IterationUI = null;
  private loggedIn: boolean = true;
  private eventListeners: any[] = [];
  private columns: any[] = [];
  private isTableConfigOpen: boolean = false;
  private workItems: WorkItemUI[] = [];
  private contentItemHeight: number = 50;
  private selectedRows: any = [];
  private detailExpandedRows: any = [];
  private showTree: boolean = false;
  private showTreeUI: boolean = false;
  private emptyStateConfig: any = {};
  private uiLockedList: boolean = false;
  private uiLockedSidebar: boolean = false;
  private hdrHeight: number = 0;
  private toolbarHt: number = 0;
  private quickaddHt: number = 0;
  private showCompleted: boolean = false;

  @ViewChild('plannerLayout') plannerLayout: PlannerLayoutComponent;
  @ViewChild('toolbar') toolbar: ElementRef;
  @ViewChild('quickaddWrapper') quickaddWrapper: ElementRef;
  @ViewChild('listContainer') listContainer: ElementRef;
  @ViewChild('myTable') table: any;
  @ViewChild('quickPreview') quickPreview: WorkItemPreviewPanelComponent;

  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private filterService: FilterService,
    private cookieService: CookieService,
    private urlService: UrlService,
    private iterationQuery: IterationQuery,
    private userQuery: UserQuery,
    private labelQuery: LabelQuery,
    private workItemQuery: WorkItemQuery,
    private areaQuery: AreaQuery,
    private groupTypeQuery: GroupTypeQuery
  ) {}

  ngOnInit() {
    const payload = {};
    let newFilterObj = {};
    this.emptyStateConfig = {
      info: 'There are no Work Items for your selected criteria',
      title: 'No Work Items Available'
    } as EmptyStateConfig;

    this.eventListeners.push(
      this.spaceSource
      .do(() => {
        this.store.dispatch(new CollaboratorActions.Get());
        this.store.dispatch(new AreaActions.Get());
        this.uiLockedSidebar = true;
        this.uiLockedList = true;
      })
      .switchMap(s => {
        return Observable.combineLatest(
          this.workItemTypeSource,
          this.areaSource,
          this.iterationSource.take(1),
          this.labelSource.take(1),
          this.collaboratorSource,
          this.routeSource
        );
      })
      .subscribe(([
        workItemTypeSource,
        areaSource,
        iterationSource,
        labelSource,
        collaboratorSource,
        queryParams
      ]) => {
        this.uiLockedSidebar = false;
        this.uiLockedList = true;
        let exp = this.filterService.queryToJson(queryParams.q);
        let fields = this.filterService.queryToFlat(queryParams.q);
        let stateFilter = fields.findIndex(f => f.field === 'state');
        if (!queryParams.hasOwnProperty('showCompleted') && !queryParams.showCompleted && stateFilter === -1) {
          this.showCompleted = false;
          // not closed state
          // TODO remove hard coded states and
          // use meta-states when available
          let stateQuery = {};
          ['closed', 'Done', 'Removed'].forEach(state => {
            stateQuery = this.filterService.queryJoiner(
              stateQuery,
              this.filterService.and_notation,
              this.filterService.queryBuilder(
                'state', this.filterService.not_equal_notation, state
              )
            );
          });
          exp = this.filterService.queryJoiner(
            exp,
            this.filterService.and_notation,
            stateQuery
          );
        } else {
          this.showCompleted = true;
        }

        // Check for tree view
        if (queryParams.hasOwnProperty('showTree') && queryParams.showTree) {
          this.showTree = true;
          exp['$OPTS'] = {'tree-view': true};
        } else {
          this.showTree = false;
          exp['$OPTS'] = {'tree-view': false};
        }

        Object.assign(payload, {
          expression: exp
        });
        this.store.dispatch(new WorkItemActions.Get({
          pageSize: 200,
          filters: payload,
          isShowTree: this.showTree
        }));
      })
    );

    const queryParams = this.route.snapshot.queryParams;
    if (Object.keys(queryParams).length === 0 ||
      (Object.keys(queryParams).length === 1 &&  // for in memory
        Object.keys(queryParams).indexOf('token_json') > -1)) {
      this.setDefaultUrl();
    }
    this.loggedIn = this.auth.isLoggedIn();
    this.setWorkItemTypes();
    this.setWorkItems();
    this.setDataTableColumns();

    // Listen for the url change
    this.eventListeners.push(
      this.router.events
        .filter(event => event instanceof NavigationStart)
        .subscribe(
        (event: any) => {
          if (event.url.indexOf('?q') === -1 &&
            event.url.indexOf('/plan/detail/') === -1 &&
            event.url.indexOf('/plan/board') === -1 &&
            event.url.indexOf('/plan') > -1) {
            this.setDefaultUrl();
          }
          if (event.url.indexOf('/plan/detail/') > -1) {
            // It's going to the detail page
            let url = location.pathname;
            let query = location.href.split('?');
            if (query.length == 2) {
              url = url + '?' + query[1];
            }
            this.urlService.recordLastListOrBoard(url);
          }
        }
        )
    );
  }

   //ngx-datatable methods
   handleReorder(event) {
    if (event.newValue !== 0) {
      this.columns[event.prevValue - 1].index = event.newValue;
      this.columns[event.newValue - 1].index = event.prevValue;
      this.columns = sortBy(this.columns, 'index');
      this.cookieService.setCookie('datatableColumn', this.columns);
    }
  }

  // Start: Settings(tableConfig) dropdown

  toggleCheckbox(event, col) {
    if (event.target.checked) {
      col.selected = true;
    } else {
      col.selected = false;
    }
  }

  moveToDisplay() {
    this.columns.filter(col => col.selected).forEach(col => {
      if (col.display === true) { return; }
      col.selected = false;
      col.display = true;
      col.showInDisplay = true;
      col.available = false;
    });
    this.updateColumnIndex();
    this.cookieService.setCookie('datatableColumn', this.columns);
    setTimeout(() => {
      this.workItems = [...this.workItems];
    }, 500);
  }

  moveToAvailable() {
    this.columns.filter(col => col.selected).forEach(col => {
      if (col.available === true) { return; }
      col.selected = false;
      col.display = false;
      col.showInDisplay = false;
      col.available = true;
    });
    this.updateColumnIndex();
    this.cookieService.setCookie('datatableColumn', this.columns);
  }

  updateColumnIndex() {
    let index = 0;
    this.columns.forEach(col => {
      if (col.display === true) {
        col.index = index + 1;
        index += 1;
      } else {
        col.index = undefined;
      }
    });
    this.columns = sortBy(this.columns, 'index');
  }

  tableConfigChange(value: boolean) {
    this.isTableConfigOpen = value;
  }

  tableConfigToggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isTableConfigOpen = false;
  }

  clickOut() {
    if (this.isTableConfigOpen) {
      this.isTableConfigOpen = false;
    }
  }

  // End:  Setting(tableConfig) Dropdown

  togglePanelState(event) {
    if (event === 'out') {
      setTimeout(() => {
        this.sidePanelOpen = true;
      }, 200);
    } else {
      this.sidePanelOpen = false;
    }
  }

  togglePanel() {
    this.plannerLayout.toggleSidePanel();
    setTimeout(() => {
    this.workItems = [...this.workItems];
    }, 500);
  }

  setDefaultUrl() {
    //redirect to default type group
    //get space id
    this.spaceSource
      .take(1)
      .subscribe(space => {
        if (space) {
          const spaceId = space.id;
          //get groupsgroups
          this.groupTypeQuery.getFirstGroupType
            .take(1)
            .subscribe(groupType => {
              const defaultGroupName = groupType.name;
              //Query for work item type group
              const type_query = this.filterService.queryBuilder('typegroup.name', this.filterService.equal_notation, defaultGroupName);
              //Query for space
              const space_query = this.filterService.queryBuilder('space', this.filterService.equal_notation, spaceId);
              //Join type and space query
              const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, space_query);
              const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, type_query);
              //const view_query = this.filterService.queryBuilder('tree-view', this.filterService.equal_notation, 'true');
              //const third_join = this.filterService.queryJoiner(second_join);
              //second_join gives json object
              let query = this.filterService.jsonToQuery(second_join);
              console.log('query is ', query);
              // { queryParams : {q: query}
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { q: query, showTree: true }
              });
            });
        }
      });
  }

  setWorkItemTypes() {
    this.eventListeners.push(
      Observable.combineLatest(
        this.workItemTypeSource,
        this.groupTypeQuery.getGroupTypes
      ).subscribe(([workItemTypes, groupTypes]) => {
        this.allWorkItemTypes = workItemTypes;
        const selectedGroupType = groupTypes.find(gt => gt.selected);
        if (selectedGroupType) {
          this.quickAddWorkItemTypes = selectedGroupType.typeList.map(type => {
            return workItemTypes.find(wit => wit.id === type.id);
          });
        } else {
          this.quickAddWorkItemTypes = workItemTypes;
        }
      })
    );
  }

  /**
   * This function listens for any change in
   * work item state and adopt it
  */
  setWorkItems() {
    this.eventListeners.push(
      this.workItemSource
        .subscribe(workItems => {
          this.uiLockedList = false;
          this.showTreeUI = this.showTree;
          this.workItems = [...workItems];
        })
    );
  }

  setDataTableColumns() {
    // Cookie for datatableColumn config
    if (!this.cookieService.getCookie(datatableColumn.length).status) {
      this.cookieService.setCookie('datatableColumn', datatableColumn);
      this.columns = datatableColumn;
    } else {
      let temp = this.cookieService.getCookie(datatableColumn.length);
      this.columns = temp.array;
    }
  }

  onSelect({ selected }) {
    // if (this.detailExpandedRows.length > 0 && this.detailExpandedRows[0].id !== selected[0].id) {
    //   this.table.rowDetail.collapseAllRows();
    //   this.detailExpandedRows = [];
    // }
    // this.workItemDataService.getItem(selected[0].id).subscribe(workItem => {
    //   this.workItemService.emitSelectedWI(workItem);
    // });
  }

  onScroll(event) {
    // if (event.path &&
    //     this._lastCheckedScrollHeight < event.path[0].scrollHeight) {
    //   let scrollLeft = ((event.path[0].scrollHeight -
    //     (event.path[0].offsetHeight + event.path[0].scrollTop)) * 100) /
    //     event.path[0].scrollHeight;
    //   if (scrollLeft <= this._scrollTrigger) {
    //     this._lastCheckedScrollHeight = event.path[0].scrollHeight;
    //     this.fetchMoreWiItems();
    //   }
    // }
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (this.workItems[index].treeStatus === 'collapsed') {
      this.workItems[index].treeStatus = 'loading';
      if (!this.workItems[index].childrenLoaded) {
        this.loadChildren(this.workItems[index]);
      } else {
        this.workItems[index].treeStatus = 'expanded';
        this.workItems = [...this.workItems];
      }
    } else {
      this.workItems[index].treeStatus = 'collapsed';
      this.workItems = [...this.workItems];
    }
  }

  loadChildren(workItem: WorkItemUI) {
    this.store.dispatch(
      // Clean object is used to remove
      // Observables from the object so that
      // it works with Redux dev-tools
      new WorkItemActions.GetChildren(
        cleanObject({...workItem}, [
          'areaObs', 'assigneesObs', 'creatorObs',
          'iterationObs', 'labelsObs']
        )
      )
    );
  }

  toggleExpandRow(row, quickAddEnabled = true) {
    if (quickAddEnabled && this.loggedIn) {
      const index = this.detailExpandedRows.findIndex(r => r.id === row.id);
      if (index > -1) {
        // For collapsing
        this.table.rowDetail.toggleExpandRow(this.detailExpandedRows[index]);
        this.detailExpandedRows.splice(index, 1);
      } else {
        // For expanding
        this.detailExpandedRows.forEach(r => {
          this.table.rowDetail.toggleExpandRow(r);
        });
        this.detailExpandedRows = [];
        this.table.rowDetail.toggleExpandRow(row);
        this.detailExpandedRows.push(row);
      }
    }
  }

  onCreateStart() {
    this.detailExpandedRows = [];
  }

  onClickLabel(event) {
    const labelId = event.id;
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    const newQuery = this.filterService.queryBuilder(
      'label',
      this.filterService.equal_notation,
      labelId
    );
    let existingQuery = {};
    if (queryParams.hasOwnProperty('q')) {
      existingQuery = this.filterService.queryToJson(queryParams['q']);
    }
    const finalQuery = this.filterService.jsonToQuery(
      this.filterService.queryJoiner(
        existingQuery,
        this.filterService.and_notation,
        newQuery
      )
    );
    queryParams['q'] = finalQuery;
    // Navigated to filtered view
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  onPreview(id: string): void {
    const workItem = this.workItems.find(w => w.id === id);
    this.quickPreview.open(workItem);
  }

  onRowDrop(event) {
    console.log(event);
    if (event.source.id === event.target.id) {
      return;
    }
    this.uiLockedList = true;
    const payload =  {
      workitem: event.source,
      destinationWorkitemID: event.target.id,
      direction: 'above'
    };
    this.store.dispatch(new WorkItemActions.Reoder(payload));
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  ngAfterViewChecked() {
    if (document.getElementsByClassName('navbar-pf').length > 0) {
      this.hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
    }
    if (this.toolbar) {
      this.toolbarHt =  this.toolbar.nativeElement.offsetHeight;
    }
    if (this.quickaddWrapper) {
      this.quickaddHt =  this.quickaddWrapper.nativeElement.offsetHeight;
    }
    let targetHeight = window.innerHeight - (this.hdrHeight + this.toolbarHt + this.quickaddHt);
    if (this.listContainer) {
      this.renderer.setStyle(this.listContainer.nativeElement, 'height', targetHeight + 'px');
    }
    // This hack is applied to get the titles in the list in order
    if (document.getElementsByClassName('planner-hack-title-truncate').length) {
      let arr = document.getElementsByClassName('planner-hack-title-truncate');
      for (let i = 0; i < arr.length; i++) {
        arr[i].parentElement.style.display = 'flex';
      }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {}
}
