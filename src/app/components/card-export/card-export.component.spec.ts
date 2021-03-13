import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExportComponent } from './card-export.component';

describe('CardExportComponent', () => {
  let component: CardExportComponent;
  let fixture: ComponentFixture<CardExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardExportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
