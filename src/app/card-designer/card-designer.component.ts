import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ImportedDataService } from '../services/imported-data.service';
import { CanvaService } from '../services/canva.service';

@Component({
  selector: 'app-card-designer',
  templateUrl: './card-designer.component.html',
  styleUrls: ['./card-designer.component.scss'],
})
export class CardDesignerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('Konva') Konva?: ElementRef<HTMLElement>;

  importedDataKeys: string[] = [];

  constructor(
    private importedDataService: ImportedDataService,
    private canvaService: CanvaService
  ) {
    this.importedDataService.importedDataSubject.subscribe((data) => {
      if (data.length > 0) {
        this.importedDataKeys = Object.keys(data[0]);
      } else {
        this.importedDataKeys = [];
      }
    });
  }

  ngAfterViewInit() {
    this.Konva?.nativeElement.appendChild(this.canvaService.getContainer());
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // this.stage.destroy();
  }

  onAddRect(): void {
    this.canvaService.addRect();
  }

  onAddText(): void {
    this.canvaService.addText();
  }

  onAddData(key: string): void {
    this.canvaService.addData(key);
  }
}
