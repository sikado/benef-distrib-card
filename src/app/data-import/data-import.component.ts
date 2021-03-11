import { Component, OnInit } from '@angular/core';
import { ImportedDataService } from '../services/imported-data.service';

@Component({
  selector: 'app-data-import',
  templateUrl: './data-import.component.html',
  styleUrls: ['./data-import.component.scss'],
})
export class DataImportComponent implements OnInit {
  importedData: {
    [key: string]: string;
  }[] = [];

  constructor(private importedDataService: ImportedDataService) {
    this.importedDataService.ImportedDataSubject.subscribe((data) => {
      this.importedData = data;
    });
  }

  ngOnInit(): void {}

  importFile(input: EventTarget | null): void {
    if (input === null) {
      return;
    }
    const file = (input as HTMLInputElement).files?.item(0);
    if (file) {
      this.importedDataService.importCSVData(file);
    }
  }
}
