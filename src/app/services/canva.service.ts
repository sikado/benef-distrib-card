import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import Konva from 'konva';
import { RectConfig } from 'konva/types/shapes/Rect';
import { TextConfig } from 'konva/types/shapes/Text';
import { Helpers } from '../helpers';
import { keyValue } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class CanvaService {
  container = document.createElement('div');
  stage: Konva.Stage;

  constructor() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: 600,
      height: 300,
    });
    this.stage.add(new Konva.Layer());

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
    this.getMainLayer().add(cadre).draw();

    this.stage.on('click', (e) => {
      let tr: Konva.Transformer | undefined = this.stage.findOne(
        'Transformer'
      ) as Konva.Transformer;
      if (tr === undefined) {
        tr = new Konva.Transformer({});
        this.getMainLayer().add(tr);
      }
      if (e.target.getType() === 'Shape' && e.target.name() !== 'cadre') {
        tr.setNodes([e.target]);
      } else {
        tr.setNodes([]);
      }
      this.getMainLayer().draw();
    });
  }

  getStage() {
    return this.stage;
  }

  getContainer() {
    return this.container;
  }

  getMainLayer() {
    return this.stage.getLayers().toArray()[0] as Konva.Layer;
  }

  addRect(attrs?: RectConfig) {
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

    this.getMainLayer().add(box).draw();
  }

  addText(attrs?: TextConfig): void {
    const textNode = new Konva.Text({
      text: 'Type some text here',
      x: Helpers.getRandomInt(this.stage.size().width - 50),
      y: Helpers.getRandomInt(this.stage.size().height - 10),
      fontSize: 20,
      draggable: true,
    });

    this.getMainLayer().add(textNode).draw();
  }

  addData(key: string, attrs?: TextConfig): void {
    const textNode = new Konva.Text({
      text: `#${key}#`,
      name: `#Data data-${key}`,
      x: Helpers.getRandomInt(this.stage.size().width - 50),
      y: Helpers.getRandomInt(this.stage.size().height - 10),
      fontSize: 20,
      draggable: true,
    });

    this.getMainLayer().add(textNode).draw();
  }

  exportToPDF(data: keyValue[]): void {
    const GRID = { x: 2, y: 5 }; // Target grid : 2 x 5
    const MARGIN = 7; // Margin 7mm
    const RATIO = 0.5; // x/y
    const PAPER_SIZE = { x: 210, y: 297 }; // A4

    // On cherche la carte la plus grande possible
    const maxSizeX = (PAPER_SIZE.x - MARGIN * (GRID.x + 1)) / GRID.x;
    const maxSizeY = (PAPER_SIZE.y - MARGIN * (GRID.y + 1)) / GRID.y;
    let imgSize = { w: maxSizeX, h: maxSizeX * RATIO };
    if (imgSize.h > maxSizeY) {
      imgSize = { w: maxSizeY / RATIO, h: maxSizeY * RATIO };
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    let dataIndex = 0; // L'index de la data en cours d'affichage dans la carte

    // Breaké si on est à la fin de importedData
    while (true) {
      for (let i = 0; i < GRID.x && dataIndex < data.length; i++) {
        for (let j = 0; j < GRID.y && dataIndex < data.length; j++) {
          this.getMainLayer()
            .find('.#Data')
            .each((node) => {
              const matches = /^#Data data-(.*)$/.exec(node.name());
              if (matches) {
                const key = matches[1];
                if (data[dataIndex][key] !== undefined) {
                  node.setAttrs({ text: data[dataIndex][key] });
                }
              }
            });
          pdf.addImage(
            // this.stage.toDataURL({ pixelRatio: 2 }) || '',
            this.stage.toCanvas({ pixelRatio: 2 }) || '',
            MARGIN + (MARGIN + imgSize.w) * i,
            MARGIN + (MARGIN + imgSize.h) * j,
            imgSize.w,
            imgSize.h
          );
          dataIndex++;
        }
      }
      if (dataIndex < data.length) {
        pdf.addPage('a4', 'p');
      } else {
        break;
      }
    }

    pdf.output('pdfobjectnewwindow');
  }
}
