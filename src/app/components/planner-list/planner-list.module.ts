import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';

import {
  HttpModule,
  Http,
  XHRBackend,
  RequestOptions
} from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-modal';
import {
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule,
  WidgetsModule
} from 'ngx-widgets';

import { ActionModule, ListModule } from 'patternfly-ng';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';

import { GlobalSettings } from '../../shared/globals';
import {
  FabPlannerAssociateIterationModalModule
} from '../work-item-iteration-modal/work-item-iteration-modal.module';
import { GroupTypesModule } from '../group-types-panel/group-types-panel.module';
import { IterationModule } from '../iterations-panel/iterations-panel.module';
import { LabelsModule } from '../labels/labels.module';
import { PlannerModalModule } from '../modal/modal.module';
import { PlannerListRoutingModule } from './planner-list-routing.module';
import { SidepanelModule } from '../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../toolbar-panel/toolbar-panel.module';
import { UrlService } from './../../services/url.service';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';
import { WorkItemDetailAddTypeSelectorModule } from '../work-item-create/work-item-create.module';
import { PlannerListComponent } from './planner-list.component';
import { WorkItemListEntryComponent } from '../work-item-list-entry/work-item-list-entry.component';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { PlannerLayoutModule } from './../../widgets/planner-layout/planner-layout.module';
import { WorkItemService } from '../../services/work-item.service';
import { MockHttp } from '../../mock/mock-http';
import { HttpService } from '../../services/http-service';
import { LabelService } from '../../services/label.service';
import { AssigneesModule } from './../assignee/assignee.module';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { EventService } from './../../services/event.service';

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { IterationState, initialState as initialIterationState } from './../../states/iteration.state';
import { iterationReducer } from './../../reducers/iteration-reducer';
import { IterationEffects } from './../../effects/iteration.effects';
import { LabelState, initialState as initialLabelState } from './../../states/label.state';
import { LabelReducer } from './../../reducers/label.reducer';
import { LabelEffects } from './../../effects/label.effects';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    BsDropdownConfig,
    GlobalSettings,
    WorkItemService,
    WorkItemDataService,
    EventService,
    Logger,
    {
      provide: HttpService,
      useClass: MockHttp
    },
    LabelService,
    TooltipConfig,
    UrlService
  ];
} else {
  providers = [
    BsDropdownConfig,
    GlobalSettings,
    WorkItemService,
    WorkItemDataService,
    EventService,
    Logger,
    {
      provide: HttpService,
      useFactory: (backend: XHRBackend, options: RequestOptions, auth: AuthenticationService) => {
        return new HttpService(backend, options, auth);
      },
      deps: [XHRBackend, RequestOptions, AuthenticationService]
    },
    LabelService,
    TooltipConfig,
    UrlService
  ];
}

@NgModule({
  imports: [
    ActionModule,
    AlmIconModule,
    AssigneesModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    DialogModule,
    FabPlannerAssociateIterationModalModule,
    HttpModule,
    InfiniteScrollModule,
    GroupTypesModule,
    IterationModule,
    LabelsModule,
    ListModule,
    ModalModule,
    PlannerLayoutModule,
    PlannerListRoutingModule,
    SidepanelModule,
    ToolbarPanelModule,
    TooltipModule.forRoot(),
    WidgetsModule,
    WorkItemDetailModule,
    WorkItemQuickAddModule,
    WorkItemDetailAddTypeSelectorModule,
    PlannerModalModule,
    StoreModule.forFeature('listPage', {
        iterations: iterationReducer,
        labels: LabelReducer
      }, {
      initialState: {
        iterations: initialIterationState,
        labels: initialLabelState
      }
    }),
    EffectsModule.forFeature([IterationEffects, LabelEffects])
  ],
  declarations: [
    PlannerListComponent,
    WorkItemListEntryComponent
  ],
  providers: providers,
  exports: [ PlannerListComponent ]
})
export class PlannerListModule {
  constructor(http: Http) {}
}
