import {
  Component,
  ElementRef,
  ViewEncapsulation,
  Input,
  Output,
  OnChanges,
  OnInit,
  ViewChild,
  EventEmitter,
  SimpleChanges,
  HostListener
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-inlineinput',
  templateUrl: './inlineinput.component.html',
  styleUrls: ['./inlineinput.component.less']
})

export class InlineInputComponent implements OnInit {
  @ViewChild('input') inputField: ElementRef;

  @Input() type: string;
  @Input('disabled') readOnly: boolean = false;
  @Input('value') set input(val) {
    const v = this.convertSpecialChar(val);
    this.inputValue = v;
    this.previousValue = v;
  }
  @Input() placeholder: string = 'Enter text here';
  @Input() onLineClickEdit: boolean = true;

  @Output() onSave = new EventEmitter();

  private inputValue: string = '';
  private saving: boolean = false;
  private editing: boolean = false;
  private previousValue: string = '';
  private errorMessage: string = '';
  private isNotValid: boolean;

  ngOnInit() {
  }

  startEditing(event: Event, onLineClick: boolean) {
    this.errorMessage = '';
    if (!this.readOnly || !this.editing &&
      ((onLineClick && this.onLineClickEdit) || !onLineClick)) {
      this.editing = true;
      this.previousValue = this.inputField.nativeElement.value;
      this.inputField.nativeElement.focus();
    } else {
      this.inputField.nativeElement.blur();
    }
  }

  saveClick() {
    this.errorMessage = '';
    this.saving = true;
    this.onSave.emit({
      value: this.inputField.nativeElement.value,
      callBack: (v: string = '', e: string = '') => this.handleSave(v, e)
    });
  }

  closeClick() {
    this.errorMessage = '';
    this.inputValue = this.previousValue;
    this.inputField.nativeElement.value = this.previousValue;
    this.previousValue = '';
    this.editing = false;
  }

  handleSave(value: string, error: string) {
    this.errorMessage = error;
    this.saving = false;
    if (this.errorMessage) {}
    else {
      this.editing = false;
      this.inputValue = value;
    }
  }

  convertSpecialChar(str: string) {
    return str.replace(/&amp;/g, "&")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&#34;/g, '"')
      .replace(/&#39;/g, "'");
  }

  submitOnEnter(event) {
    console.log("####-2");
    event.preventDefault();
    this.saveClick();
    this.inputField.nativeElement.blur();
  }
  onkeyDown(event) {
    console.log("####-1");
    let keycode = event.keyCode ? event.keyCode : event.which;
    if(this.editing && keycode !== 13) {     
      switch (this.type) {
        case 'integer':
          if(this.checkInteger(keycode, event)){
            console.log("####-3");
            this.isNotValid = false;
          } else {
            this.isNotValid = true;
            console.log("####-4");
            event.preventDefault();
          }
          break;
        case 'float':
          if(this.checkInteger(keycode, event) ||
             keycode === 190) {
            this.isNotValid = false;
          } else {
            this.isNotValid = true;
            event.preventDefault();
          }
          break;
        case 'string':
          this.isNotValid = false;
          break;
        default:
          break;
      }
    }
  }

  checkInteger(keycode, event) {
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(keycode) !== -1 ||
      // Allow: Ctrl+A
      (keycode === 65 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+C
      (keycode === 67 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+V
      (keycode === 86 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+X
      (keycode === 88 && (event.ctrlKey || event.metaKey)) ||
      // Allow: home, end, left, right
      (keycode >= 35 && keycode <= 39)) {
        // let it happen, is valid: true
        return true;
      }
      // Ensure that it is a number and stop the keypress
      if ((event.shiftKey || (keycode < 48 || keycode > 57)) && (keycode < 96 || keycode > 105)) {
          return false;
      }
    }
}
