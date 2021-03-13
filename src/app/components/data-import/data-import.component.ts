import { Component, OnInit } from '@angular/core';
import { ImportedDataService } from '../../services/imported-data.service';

@Component({
  selector: 'app-data-import',
  templateUrl: './data-import.component.html',
  styleUrls: ['./data-import.component.scss'],
})
export class DataImportComponent implements OnInit {
  importedData: {
    [key: string]: string;
  }[] = [];
  importedDataError: Papa.ParseError[] = [];

  constructor(private importedDataService: ImportedDataService) {
    this.importedDataService.importedDataSubject.subscribe((data) => {
      this.importedData = data;
    });
    this.importedDataService.lastImportErrorSubject.subscribe((errors) => {
      this.importedDataError = errors;
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

  importTestData(): void {
    this.importedDataService.importCSVData();
  }
}
