import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { keyValue } from '../../models/types';
import { CanvaService } from '../../services/canva.service';
import { ImportedDataService } from '../../services/imported-data.service';
import * as PdfLib from 'pdfjs-dist';
import { RenderParameters } from 'pdfjs-dist/types/display/api';
import { FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-card-export',
  templateUrl: './card-export.component.html',
  styleUrls: ['./card-export.component.scss'],
})
export class CardExportComponent implements OnInit, AfterViewInit {
  @ViewChild('Pdfjs') Pdfjs?: ElementRef<HTMLCanvasElement>;

  importedData: keyValue[] = [];
  pdfConfigForm = this.fb.group({
    printMargin: [5.0],
    internalMargin: [0],
  });
  cardSize;

  constructor(
    private importedDataService: ImportedDataService,
    private canvaService: CanvaService,
    private fb: FormBuilder
  ) {
    this.importedDataService.importedDataSubject.subscribe((data) => {
      this.importedData = data;
    });
    this.pdfConfigForm.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.displayPreview(); // Update de la preview lors des changements du form de config
    });
    PdfLib.GlobalWorkerOptions.workerSrc = './assets/pdf.worker.min.js';
    this.cardSize = this.canvaService.getCardSize();
  }

  ngAfterViewInit(): void {
    try {
      this.displayPreview(); // Premier affichage de la preview
    } catch (err) {
      alert('La carte est trop grande pour une feuille A4 en portait');
    }
  }

  ngOnInit(): void {}

  onExport(): void {
    this.canvaService.exportToPDF(
      this.importedData,
      this.pdfConfigForm.get('printMargin')?.value,
      this.pdfConfigForm.get('internalMargin')?.value
    );
  }

  displayPreview() {
    if (
      this.Pdfjs?.nativeElement === undefined ||
      this.Pdfjs?.nativeElement.parentElement === null
    ) {
      return;
    }
    const canvaElem = this.Pdfjs?.nativeElement;
    const canvaParent = this.Pdfjs?.nativeElement.parentElement;

    const pdfPreviewData = this.canvaService.getPDFPreview(
      this.importedData,
      this.pdfConfigForm.get('printMargin')?.value,
      this.pdfConfigForm.get('internalMargin')?.value
    );

    const loadingTask = PdfLib.getDocument(pdfPreviewData);
    loadingTask.promise
      .then((pdf) => {
        pdf.getPage(1).then((page) => {
          const desiredWidth: number =
            canvaParent.clientWidth -
              2 *
                Number.parseInt(
                  window.getComputedStyle(canvaParent).paddingLeft,
                  10
                ) || 400;
          const viewport = page.getViewport({ scale: 1 });
          const scale = desiredWidth / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          // Prepare canvas using PDF page dimensions
          const context = canvaElem.getContext('2d');
          canvaElem.height = scaledViewport.height;
          canvaElem.width = scaledViewport.width;

          // Render PDF page into canvas context
          const renderContext: RenderParameters = {
            // eslint-disable-next-line @typescript-eslint/ban-types
            canvasContext: context as Object,
            viewport: scaledViewport,
          };
          page.render(renderContext);
          /* const renderTask =
          renderTask.promise.then(() => {
            console.log('Page rendered');
          }); */
        });
      })
      .catch((err) => {
        // PDF loading error
        console.error(err);
      });
  }
}
