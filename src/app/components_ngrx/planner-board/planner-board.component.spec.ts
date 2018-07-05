// import { CommonModule } from '@angular/common';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { EffectsModule } from '@ngrx/effects';
// import { StoreModule } from '@ngrx/store';
// import { Broadcaster, Logger, Notifications } from 'ngx-base';
// import { TooltipConfig, TooltipModule } from 'ngx-bootstrap';
// import { Spaces } from 'ngx-fabric8-wit';
// import { AUTH_API_URL, REALM, SSO_API_URL } from 'ngx-login-client';

// import { WorkItemService } from './../../services/work-item.service';
// import { PlannerLayoutModule } from './../../widgets/planner-layout/planner-layout.module';
// import { SidepanelModule } from './../side-panel/side-panel.module';
// import { WorkItemPreviewPanelModule } from './../work-item-preview-panel/work-item-preview-panel.module';
// import { PlannerBoardComponent } from './planner-board.component';

// fdescribe('BoardComponent :: ', () => {
//   let component: PlannerBoardComponent;
//   let fixture: ComponentFixture<PlannerBoardComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         TooltipConfig,
//         WorkItemService,
//         Broadcaster,
//         {
//           provide: AUTH_API_URL,
//           useValue: 'https://api.url.com'
//         },
//         {
//           provide: SSO_API_URL,
//           useValue: 'https://sso.url.com'
//         },
//         {
//           provide: REALM,
//           useValue: 'fabric8-realm'
//         },
//         Logger,
//         Spaces,
//         Notifications
//       ],
//       declarations: [
//         PlannerBoardComponent
//       ],
//       imports: [
//         CommonModule,
//         PlannerLayoutModule,
//         StoreModule.forRoot({}),
//         EffectsModule.forRoot([]),
//         WorkItemPreviewPanelModule,
//         SidepanelModule,
//         TooltipModule.forRoot()
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PlannerBoardComponent);
//     component = fixture.componentInstance;
//   });

//   it('sidePanelOpen value should be true initially', () => {
//     expect(component.sidePanelOpen).toBeTruthy();
//   });
// });
