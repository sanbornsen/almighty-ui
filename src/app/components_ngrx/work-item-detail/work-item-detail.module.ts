import { CommonSelectorModule } from './../common-selector/common-selector.module';
import { LabelsModule } from './../labels/labels.module';
import { TypeaheadDropDownModule } from './../../components/typeahead-dropdown/typeahead-dropdown.module';
import { AlmUserNameModule } from './../../pipes/alm-user-name.module';
import { AssigneesModule } from './../assignee/assignee.module';
import { AssigneeSelectorModule } from './../assignee-selector/assignee-selector.module';
import { AuthenticationService } from 'ngx-login-client';
import { RouterModule } from '@angular/router';
import { InlineInputModule } from './../../widgets/inlineinput/inlineinput.module';
import { WidgetsModule, MarkdownModule } from 'ngx-widgets';
import { FormsModule } from '@angular/forms';
import { UserMapper } from './../../models/user';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkItemDetailComponent } from './work-item-detail.component';
import { WorkItemDetailRoutingModule } from './work-item-detail-routing.module';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import {
  WorkItemCommentWrapperModule
} from './../work-item-comment-wrapper/work-item-comment-wrapper.module';
import { PlannerModalModule } from '../../components/modal/modal.module';
import  { WorkItemLinkModule } from './../work-item-link/work-item-link.module';

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommentState, initialState as initialCommentState } from './../../states/comment.state';
import { CommentReducer } from './../../reducers/comment.reducer';
import { CommentEffects } from './../../effects/comment.effects';
import {
  DetailWorkItemState,
  initialState as initialDetailWIState
} from './../../states/detail-work-item.state';
import { DetailWorkItemReducer } from './../../reducers/detail-work-item.reducer';
import { DetailWorkItemEffects } from './../../effects/detail-work-item.effects';
import { WorkItemLinkReducer } from './../../reducers/work-item-link.reducer';
import { WorkItemLinkEffects } from './../../effects/work-item-link.effects';
import { WorkItemLinkState, initialState as initialWILinkState } from './../../states/work-item-link.state';
import { LinkTypeReducer } from './../../reducers/link-type.reducer';
import { LinkTypeEffects } from './../../effects/link-type.effects';
import { LinkTypeState, initialState as initialLinkTypeState } from './../../states/link-type.state';

import { UrlService } from '../../services/url.service';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LabelSelectorModule } from '../label-selector/label-selector.module';

@NgModule({
  imports: [
    AlmUserNameModule,
    AssigneesModule,
    AssigneeSelectorModule,
    CommonModule,
    CommonSelectorModule,
    FormsModule,
    WidgetsModule,
    InlineInputModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadDropDownModule,
    LabelsModule,
    LabelSelectorModule,
    MarkdownModule,
    WorkItemCommentWrapperModule,
    PlannerModalModule,
    WorkItemLinkModule,
    StoreModule.forFeature('detailPage', {
      comments: CommentReducer,
      workItem: DetailWorkItemReducer,
      linkType: LinkTypeReducer,
      workItemLink: WorkItemLinkReducer
    }, {
      initialState: {
        comments: initialCommentState,
        workItem: initialDetailWIState,
        linkType: initialLinkTypeState,
        workItemLink: initialWILinkState
      }
    }),
    EffectsModule.forFeature([
      CommentEffects,
      DetailWorkItemEffects,
      LinkTypeEffects,
      WorkItemLinkEffects
    ])
  ],
  providers: [
    UserMapper,
    UrlService,
    BsDropdownConfig,
    AuthenticationService,
    TooltipConfig
  ],
  declarations: [
    WorkItemDetailComponent
  ],
  exports: [
    WorkItemDetailComponent
  ]
})
export class WorkItemDetailModule {}
