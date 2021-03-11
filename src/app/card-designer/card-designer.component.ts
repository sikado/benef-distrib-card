import { Component, OnDestroy, OnInit } from '@angular/core';
import Konva from 'konva';
import jsPDF from 'jspdf';
import { Helpers } from './../helpers';
import { ImportedDataService } from '../services/imported-data.service';

@Component({
  selector: 'app-card-designer',
  templateUrl: './card-designer.component.html',
  styleUrls: ['./card-designer.component.scss'],
})
export class CardDesignerComponent implements OnInit, OnDestroy {
  readonly KONVA_CONTRAINER_ID = 'konva-container';

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  transformer?: Konva.Transformer;

  importedDataKeys: string[] = [];
  importedData: { [key: string]: string }[] = [];

  constructor(private importedDataService: ImportedDataService) {
    this.importedDataService.ImportedDataSubject.subscribe((data) => {
      this.importedData = data;
      if (data.length > 0) {
        this.importedDataKeys = Object.keys(data[0]);
      } else {
        this.importedDataKeys = [];
      }
    });
  }

  ngOnInit(): void {
    try {
      const savedStage = localStorage.getItem('canva');
      if (savedStage !== null) {
        this.stage = Konva.Node.create(savedStage, this.KONVA_CONTRAINER_ID);
        this.layer = this.stage.getLayer();
      }
    } catch {
      // void
    }
    this.initStage();
  }

  ngOnDestroy(): void {
    this.stage.destroy();
  }

  onAddRect(): void {
    const DEFAULT_RECT_SIZE = { width: 100, height: 50 };
    const box = new Konva.Rect({
      x: Helpers.getRandomInt(
        this.stage.size().width - DEFAULT_RECT_SIZE.width
      ),
      y: Helpers.getRandomInt(
        this.stage.size().height - DEFAULT_RECT_SIZE.height
      ),
      width: DEFAULT_RECT_SIZE.width,
      height: DEFAULT_RECT_SIZE.height,
      fill: '#00D2FF',
      stroke: '#000000',
      strokeWidth: 4,
      draggable: true,
    });

    this.layer.add(box);
    this.layer.draw();
  }

  onAddText(): void {
    const textNode = new Konva.Text({
      text: 'Type some text here',
      x: Helpers.getRandomInt(this.stage.size().width - 50),
      y: Helpers.getRandomInt(this.stage.size().height - 10),
      fontSize: 20,
      draggable: true,
    });

    this.layer.add(textNode);
    this.layer.draw();
  }

  onAddData(key: string): void {
    const textNode = new Konva.Text({
      text: `#${key}#`,
      name: `#Data data-${key}`,
      x: Helpers.getRandomInt(this.stage.size().width - 50),
      y: Helpers.getRandomInt(this.stage.size().height - 10),
      fontSize: 20,
      draggable: true,
    });

    this.layer.add(textNode);
    this.layer.draw();
  }

  onClearSave(): void {
    localStorage.removeItem('canva');
    this.stage.destroy();
    this.initStage();
  }

  onSave(): void {
    localStorage.setItem('canva', this.stage.toJSON());
  }

  onExport(): void {
    const GRID = { x: 2, y: 5 }; // Target grid : 2 x 5
    const MARGIN = 7; // Margin 7mm
    const RATIO = 0.5; // x/y
    const PAPER_SIZE = { x: 210, y: 297 }; // A4

    // On cherche la carte la plus grande possible
    const maxSizeX = (PAPER_SIZE.x - MARGIN * (GRID.x + 1)) / GRID.x;
    const maxSizeY = (PAPER_SIZE.y - MARGIN * (GRID.y + 1)) / GRID.y;
    let IMG_SIZE = { w: maxSizeX, h: maxSizeX * RATIO };
    if (IMG_SIZE.h > maxSizeY) {
      IMG_SIZE = { w: maxSizeY / RATIO, h: maxSizeY * RATIO };
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    let dataIndex = 0; // L'index de la data en cours d'affichage dans la carte

    // Breaké si on est à la fin de importedData
    while (true) {
      for (let i = 0; i < GRID.x && dataIndex < this.importedData.length; i++) {
        for (
          let j = 0;
          j < GRID.y && dataIndex < this.importedData.length;
          j++
        ) {
          this.layer.find('.#Data').each((node) => {
            const matches = /^#Data data-(.*)$/.exec(node.name());
            if (matches) {
              const key = matches[1];
              if (this.importedData[dataIndex][key] !== undefined) {
                node.setAttrs({ text: this.importedData[dataIndex][key] });
              }
            }
          });
          pdf.addImage(
            // this.stage.toDataURL({ pixelRatio: 2 }) || '',
            this.stage.toCanvas({ pixelRatio: 2 }) || '',
            MARGIN + (MARGIN + IMG_SIZE.w) * i,
            MARGIN + (MARGIN + IMG_SIZE.h) * j,
            IMG_SIZE.w,
            IMG_SIZE.h
          );
          dataIndex++;
        }
      }
      if (dataIndex < this.importedData.length) {
        pdf.addPage('a4', 'p');
      } else {
        break;
      }
    }

    pdf.output('pdfobjectnewwindow');
  }

  updateNodeAttrs(attrs: { [key: string]: any }): void {
    const selectedNode = this.transformer?.getNode();
    if (selectedNode !== undefined) {
      selectedNode.setAttrs(attrs);
      this.layer.draw();
    }
  }

  private initStage() {
    if (this.stage === undefined) {
      const containerWidth =
        document.getElementById(this.KONVA_CONTRAINER_ID)?.clientWidth || 400;
      this.stage = new Konva.Stage({
        container: this.KONVA_CONTRAINER_ID,
        width: containerWidth,
        height: containerWidth / 2,
      });
      this.layer = new Konva.Layer();
      this.stage.add(this.layer);
      const cadre = new Konva.Rect({
        name: 'cadre',
        x: 0,
        y: 0,
        width: this.stage.getSize().width,
        height: this.stage.getSize().height,
        stroke: 'black',
        strokeWidth: 1,
        fill: 'white',
      });
      this.layer.add(cadre);
    }

    this.stage.on('click', (e) => {
      if (this.transformer !== undefined) {
        this.transformer.destroy();
      }
      if (e.target.getType() === 'Shape' && e.target.name() !== 'cadre') {
        this.transformer = new Konva.Transformer({
          nodes: [e.target],
        });
        this.layer.add(this.transformer);
      }
      this.layer.draw();
    });

    this.layer.draw();
  }
}
