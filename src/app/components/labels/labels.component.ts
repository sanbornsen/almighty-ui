import { cloneDeep } from 'lodash';
import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FilterService } from '../../services/filter.service';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { LabelModel } from './../../models/label.model';

@Component({
  selector: 'f8-label',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.less']
})

export class LabelsComponent implements OnInit {

  private _labels: LabelModel[] = [];

  @Input('labels') set labelInput(labels: LabelModel[]) {
    this._labels = labels.filter(label => {
      return label.attributes &&
        label.attributes['background-color'] &&
        label.attributes['text-color']
    })
  };

  @Input() truncateAfter: number;
  @Input() allowDelete: boolean;
  @Output() onLabelClick = new EventEmitter();
  @Output() onRemoveLabel = new EventEmitter();

  private labels: LabelModel[] = [];
  private showMore: boolean = false;
  private spaceSubscription: Subscription = null;
  private spaceId;

  constructor(
    private filterService: FilterService,
    private spaces: Spaces
  ) {}

  ngOnInit() {
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        this.spaceId = space.id;
      } else {
        console.log('[Guided Work Item Types] Space deselected.');
      }
    });
  }

  moreClick(event) {
    event.stopPropagation();
  }

  clickLabel(label, event) {
    event.stopPropagation();
    this.onLabelClick.emit(label);
  }

  removeLabel(label, event) {
    event.stopPropagation();
    this.onRemoveLabel.emit(label);
  }
}
