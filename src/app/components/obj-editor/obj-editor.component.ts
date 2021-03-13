import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ColorPickerControl } from '@iplab/ngx-color-picker';
import Konva from 'konva';
import { debounceTime } from 'rxjs/operators';
import { keyValue as KeyValue } from '../../models/types';
import { CanvaService } from '../../services/canva.service';

@Component({
  selector: 'app-obj-editor',
  templateUrl: './obj-editor.component.html',
  styleUrls: ['./obj-editor.component.scss'],
})
/**
 * @TODO Rendre le template dynamique basé sur une class dédié (https://angular.io/guide/dynamic-form)
 */
export class ObjEditorComponent implements OnInit {
  selectedShape?: Konva.Shape;

  public compactControl = new ColorPickerControl();
  showColorPicker = false;
  showColorPickerStroke = false;

  objForm = this.fb.group({
    text: [{ value: undefined, disabled: true }],
    fontSize: [{ value: undefined, disabled: true }],
    fill: [{ value: undefined, disabled: true }],
    stroke: [{ value: undefined, disabled: true }],
    strokeWidth: [{ value: undefined, disabled: true }],
  });

  constructor(private fb: FormBuilder, private canvaService: CanvaService) {
    this.canvaService.selectedShapeSubject.subscribe((shape) => {
      this.selectedShape = shape;
      if (this.selectedShape !== undefined) {
        const attrs = this.selectedShape.getAttrs() as KeyValue;
        Object.keys(this.objForm.controls).forEach((key) => {
          if (attrs[key] === undefined) {
            this.objForm.controls[key].disable({ emitEvent: false });
            this.objForm.controls[key].setValue(undefined, {
              emitEvent: false,
            });
          } else {
            this.objForm.controls[key].enable({ emitEvent: false });
            this.objForm.controls[key].setValue(attrs[key], {
              emitEvent: false,
            });
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.objForm.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      if (this.selectedShape !== undefined) {
        this.selectedShape.setAttrs({ ...this.objForm.value });
        this.canvaService.getMainLayer().draw();
      }
    });
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
