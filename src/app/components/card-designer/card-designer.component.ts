import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ImportedDataService } from '../../services/imported-data.service';
import { CanvaService } from '../../services/canva.service';

@Component({
  selector: 'app-card-designer',
  templateUrl: './card-designer.component.html',
  styleUrls: ['./card-designer.component.scss'],
})
export class CardDesignerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('Konva') KonvaContainer?: ElementRef<HTMLElement>;

  importedDataKeys: string[] = [];
  cardSize; // Taille de la carte finale, en mm

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
    this.cardSize = this.canvaService.getCardSize();
  }

  ngAfterViewInit() {
    if (this.KonvaContainer !== undefined) {
      this.canvaService.displayCanva(this.KonvaContainer.nativeElement);
    }
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

  onAddImg(e: MouseEvent): void {
    this.canvaService.addImg(e.target as HTMLImageElement);
  }

  onCardSizeChange(): void {
    this.canvaService.changeSize(this.cardSize);
  }

  setPredefinedRatio(x: number, y: number): void {
    this.cardSize.width = x;
    this.cardSize.height = y;
    this.onCardSizeChange();
  }
}
