import { Component, OnInit } from '@angular/core';
import { keyValue } from '../../models/types';
import { CanvaService } from '../../services/canva.service';
import { ImportedDataService } from '../../services/imported-data.service';

@Component({
  selector: 'app-card-export',
  templateUrl: './card-export.component.html',
  styleUrls: ['./card-export.component.scss'],
})
export class CardExportComponent implements OnInit {
  importedData: keyValue[] = [];
  margin = 7.0;
  grid = { x: 2, y: 5 };

  constructor(
    private importedDataService: ImportedDataService,
    private canvaService: CanvaService
  ) {
    this.importedDataService.importedDataSubject.subscribe((data) => {
      this.importedData = data;
    });
  }

  ngOnInit(): void {}

  onExport(): void {
    this.canvaService.exportToPDF(this.importedData, this.grid, this.margin);
  }
}