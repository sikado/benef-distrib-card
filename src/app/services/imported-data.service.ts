import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportedDataService {
  importedData: { [key: string]: string }[] = [];
  importedDataSubject = new BehaviorSubject<{ [key: string]: string }[]>(
    this.importedData
  );

  lastImportError: Papa.ParseError[] = [];
  lastImportErrorSubject = new BehaviorSubject<Papa.ParseError[]>(
    this.lastImportError
  );

  constructor() {}

  importCSVData(file?: File) {
    const path =
      file === undefined
        ? `${window.location.href}/assets/samplesData/users-50.csv`
        : file;

    Papa.parse(path, {
      download: file === undefined, // If undefined, we use the sampleFile
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        this.importedData = (results.data as { [key: string]: string }[]) || [];
        this.lastImportError = results.errors;
        this.updateSubs();
      },
    });
  }

  private updateSubs(): void {
    this.importedDataSubject.next(this.importedData);
    this.lastImportErrorSubject.next(this.lastImportError);
  }
}
