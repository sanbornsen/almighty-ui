import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import {
  WidgetsModule
} from 'ngx-widgets';

import { GroupTypesComponent } from './group-types-panel.component';
import { GroupTypesService } from '../../services/group-types.service';
import { ModalModule } from 'ngx-modal';
import { TooltipModule } from 'ng2-bootstrap';
import { TruncateModule } from 'ng2-truncate';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    TooltipModule,
    TruncateModule,
    WidgetsModule,
    RouterModule
  ],
  declarations: [
    GroupTypesComponent
  ],
  exports: [GroupTypesComponent],
  providers: [GroupTypesService]
})
export class GroupTypesModule { }
