import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ColorPickerControl } from '@iplab/ngx-color-picker';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-obj-editor',
  templateUrl: './obj-editor.component.html',
  styleUrls: ['./obj-editor.component.scss'],
})
/**
 * @TODO Rendre le template dynamique basé sur une class dédié (https://angular.io/guide/dynamic-form)
 */
export class ObjEditorComponent implements OnInit, OnChanges {
  @Input() nodeAttrs?: { [key: string]: any };
  @Output() update = new EventEmitter<{ [key: string]: any }>();

  public compactControl = new ColorPickerControl();
  showColorPicker = false;
  showColorPickerStroke = false;

  objForm = this.fb.group({
    text: [undefined],
    fontSize: [undefined],
    fill: [undefined],
    stroke: [undefined],
    strokeWidth: [undefined],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.objForm.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      if (this.nodeAttrs !== undefined) {
        this.update.emit(this.objForm.value);
      }
    });
  }

  ngOnChanges(): void {
    if (this.nodeAttrs !== undefined) {
      Object.keys(this.objForm.controls).forEach((key) => {
        if (this.nodeAttrs?.[key] === undefined) {
          this.objForm.controls[key].disable();
          this.objForm.controls[key].setValue(undefined, {
            emitEvent: false,
          });
        } else {
          this.objForm.controls[key].enable();
          if (this.nodeAttrs?.[key] !== undefined) {
            this.objForm.controls[key].setValue(this.nodeAttrs?.[key] || '', {
              emitEvent: false,
            });
          } else {
            this.objForm.controls[key].reset({
              emitEvent: false,
            });
          }
        }
      });
    }
  }

  onFocusInStroke(): void {
    this.showColorPickerStroke = true;
  }

  onFocusOutStroke(): void {
    this.objForm.controls.stroke.setValue(
      this.compactControl.value.toHexString()
    );
    this.showColorPickerStroke = false;
  }

  onFocusIn(): void {
    this.showColorPicker = true;
  }

  onFocusOut(): void {
    this.objForm.controls.fill.setValue(
      this.compactControl.value.toHexString()
    );
    this.showColorPicker = false;
  }
}
