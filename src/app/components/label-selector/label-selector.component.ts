import { EventService } from './../../services/event.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { LabelModel } from './../../models/label.model';
import { LabelService } from './../../services/label.service';
import {
  SelectDropdownComponent
} from './../../widgets/select-dropdown/select-dropdown.component';

import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as LabelActions from './../../actions/label.actions';

@Component({
  selector: 'label-selector',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.less']
})

export class LabelSelectorComponent implements OnInit, OnChanges {

  @ViewChild('labelname') labelnameInput: ElementRef;
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;
  @Input() allLabels: LabelModel[] = [];
  @Input() selectedLabels: LabelModel[] = [];

  @Output() onSelectLable: EventEmitter<LabelModel[]> = new EventEmitter();
  @Output() onOpenSelector: EventEmitter<any> = new EventEmitter();
  @Output() onCloseSelector: EventEmitter<LabelModel[]> = new EventEmitter();

  private activeAddLabel: boolean = false;
  private backup: any[] = [];
  private colorPickerActive: boolean = false;
  private colors: any[] = [];
  private createDisabled: boolean = false;
  private labels: any[] = [];
  private newSelectedColor: any = {};
  private searchValue: string = '';

  constructor(
    private labelService: LabelService,
    private eventService: EventService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.colors = [
      {color: '#fbdebf', border: '#f39d3c'},
      {color: '#f7bd7f', border: '#f39d3c'},
      {color: '#fbeabc', border: '#f39d3c'},
      {color: '#f9d67a', border: '#f39d3c'},
      {color: '#e4f5bc', border: '#ace12e'},
      {color: '#cfe7cd', border: '#6ec664'},
      {color: '#9ecf99', border: '#6ec664'},
      {color: '#bedee1', border: '#3a9ca6'},
      {color: '#7dbdc3', border: '#3a9ca6'},
      {color: '#beedf9', border: '#35caed'},
      {color: '#7cdbf3', border: '#35caed'},
      {color: '#c7bfff', border: '#8461f7'},
      {color: '#a18fff', border: '#8461f7'},
      {color: '#ededed', border: '#bbbbbb'},
      {color: '#d1d1d1', border: '#bbbbbb'}
    ];
    this.newSelectedColor = this.colors[Math.floor(Math.random()*this.colors.length)];
  }

  ngOnChanges(changes: SimpleChanges) {
    if( changes.allLabels ) {
      this.backup = cloneDeep(this.allLabels.map((label: LabelModel) => {
        return {
          id: label.id,
          color: label.attributes['background-color'],
          border: label.attributes['border-color'],
          name: label.attributes.name,
          selected: false
        }
      }));
      if (this.searchValue.length) {
        this.labels =
          cloneDeep(this.backup.filter(i => i.name.indexOf(this.searchValue) > - 1));
      }
      else {
        this.labels = cloneDeep(this.backup);
      }
    }
    if( changes.selectedLabels ) {
      this.updateSelection();
    }
  }


  onSelect(event: any) {
    let findSelectedIndex = this.selectedLabels.findIndex(i => i.id === event.id);
    if (findSelectedIndex > -1) {
      this.selectedLabels.splice(findSelectedIndex, 1);
    } else {
      let findLabel = cloneDeep(this.allLabels.find(i => i.id === event.id));
      if (findLabel) {
        this.selectedLabels.push(findLabel);
      }
    }
    this.updateSelection();
    this.onSelectLable.emit(cloneDeep(this.selectedLabels));
  }

  updateSelection() {
    this.labels.forEach((label, index) => {
      if (this.selectedLabels.find(l => label.id === l.id)) {
        this.labels[index].selected = true;
      } else {
        this.labels[index].selected = false;
      }
    });
    this.backup.forEach((label, index) => {
      if (this.selectedLabels.find(l => label.id === l.id)) {
        this.backup[index].selected = true;
      } else {
        this.backup[index].selected = false;
      }
    });
  }

  onSearch(event: any) {
    let needle = event.trim();
    this.searchValue = needle;
    if (needle.length) {
      this.labels = cloneDeep(this.backup.filter(i => i.name.indexOf(needle) > -1));
    } else {
      this.labels = cloneDeep(this.backup);
    }
  }

  clickOnAddLabel() {
    this.newSelectedColor = this.colors[Math.floor(Math.random()*this.colors.length)];
    this.activeAddLabel = true;
  }

  closeAddLabel() {
    this.activeAddLabel = false;
  }

  toggleColorPicker() {
    this.colorPickerActive = !this.colorPickerActive;
  }

  selectColor(color: any) {
    this.newSelectedColor = color;
  }
  createLabel(name: any) {
    if (name.trim() === '' || this.createDisabled) {
      return;
    }
    this.createDisabled = true;
    let labelPayload: LabelModel  = {
      attributes: {
        'name': name,
        'background-color': this.newSelectedColor.color,
        'border-color': this.newSelectedColor.border
      },
      type: 'labels'
    };
    this.store.dispatch({type: LabelActions.ADD, payload: labelPayload});
    this.store.select(state => {
      return state.listPage.labels
    })
    .subscribe(data => {
      this.createDisabled = false;
      this.newSelectedColor = this.colors[Math.floor(Math.random()*this.colors.length)];
      this.allLabels = data.labels;
      if( data.newLabel !== null) {
        const newLabel = {
          id: data.newLabel.id,
          color: data.newLabel.attributes['background-color'],
          border: data.newLabel.attributes['border-color'],
          name: data.newLabel.attributes.name,
          selected: false
        };

        this.backup = [cloneDeep(newLabel), ...this.backup];
        if (this.searchValue === '' ||
          (this.searchValue !== '' &&
            name.indexOf(this.searchValue) > - 1
          )
        ) {
          this.labels = [cloneDeep(newLabel), ...this.labels];
        }
      }
      this.labelnameInput.nativeElement.value = '';
      this.labelnameInput.nativeElement.focus();
    })
  }

  onOpen(event) {
    this.onOpenSelector.emit('open');
  }

  onClose(event) {
    this.onCloseSelector.emit(cloneDeep(this.selectedLabels));
  }

  openDropdown() {
    this.dropdownRef.openDropdown();
  }

  closeDropdown() {
    this.dropdownRef.closeDropdown();
  }
}
