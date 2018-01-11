import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { PlannerLayoutComponent } from './../../widgets/planner-layout/planner-layout.component';
import { Space } from 'ngx-fabric8-wit';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as IterationActions from './../../actions/iteration.actions';
import * as GroupTypeActions from './../../actions/group-type.actions';
import * as SpaceActions from './../../actions/space.actions';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': ''
  },
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})

export class PlannerListComponent implements OnInit {
  private uiLockedAll: boolean = false;
  private sidePanelOpen: boolean = true;

  @ViewChild('plannerLayout') plannerLayout: PlannerLayoutComponent;
  @ViewChild('containerHeight') containerHeight: ElementRef;

  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.resizeHeight();
    this.store.dispatch(new SpaceActions.Get());
    this.store
      .select('listPage')
      .select('space')
      .filter(space => space !== null)
      .subscribe((space: Space) => {
        this.store.dispatch(new IterationActions.Get());
        this.store.dispatch(new GroupTypeActions.Get());
      })
  }

  resizeHeight() {
    setTimeout(() => {
      const navElemnts = document.getElementsByTagName('nav');
      const navHeight = navElemnts[0].offsetHeight;
      const totalHeight = window.innerHeight;
      this.renderer.setStyle(
        this.containerHeight.nativeElement,
        'height',
        (totalHeight - navHeight) + "px");
    }, 200)
  }

  togglePanelState(event) {
    if (event === 'out') {
      setTimeout(() => {
        this.sidePanelOpen = true;
      }, 200)
    } else {
      this.sidePanelOpen = false;
    }
  }

  togglePanel() {
    this.plannerLayout.toggleSidePanel();
  }
}
