import { LabelService } from './../../services/label.service';
import { SelectDropdownModule } from './../../widgets/select-dropdown/select-dropdown.module';
import { LabelSelectorComponent } from './label-selector.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WidgetsModule } from 'ngx-widgets';
import { EventService } from './../../services/event.service';

//ngrx/stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LabelState, initialState as initialLabelState } from './../../states/label.state';
import { LabelReducer } from './../../reducers/label.reducer';
import { LabelEffects } from './../../effects/label.effects';

@NgModule({
  imports: [
    WidgetsModule,
    CommonModule,
    SelectDropdownModule,
    StoreModule.forFeature('listPage', {
        labels: LabelReducer
      },{
        initialState: {
          labels: initialLabelState
        }
      }
    ),
    EffectsModule.forFeature([
      LabelEffects
    ])
  ],
  declarations: [
    LabelSelectorComponent
  ],
  exports: [
    LabelSelectorComponent
  ],
  providers: [
    LabelService,
    EventService
  ]
})

export class LabelSelectorModule {

}
