import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjEditorComponent } from './obj-editor.component';

describe('ObjEditorComponent', () => {
  let component: ObjEditorComponent;
  let fixture: ComponentFixture<ObjEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
