import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportedDataService {
  importedData: { [key: string]: string }[] = [];
  lastImportError?: Papa.ParseError[];

  ImportedDataSubject = new BehaviorSubject<{ [key: string]: string }[]>(
    this.importedData
  );

  constructor() {}

  async importCSVData(file: File) {
    return new Promise<void>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            this.importedData =
              (results.data as { [key: string]: string }[]) || [];
            this.updateSubs();
            return resolve();
          } else {
            this.lastImportError = results.errors;
            console.error(results.errors);
            return reject(new Error());
          }
        },
      });
    });
  }

  private updateSubs(): void {
    this.ImportedDataSubject.next(this.importedData);
  }
}
