import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import Konva from 'konva';
import { RectConfig } from 'konva/types/shapes/Rect';
import { TextConfig } from 'konva/types/shapes/Text';
import { BehaviorSubject } from 'rxjs';
import { Helpers } from '../helpers';
import { keyValue } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class CanvaService {
  container = document.createElement('div');
  stage: Konva.Stage;

  selectedShapeSubject = new BehaviorSubject<Konva.Shape | undefined>(
    undefined
  );

  readonly DEFAULT_WIDTH = 600;
  cardSize = {
    width: 70,
    height: 35,
  };

  constructor() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.DEFAULT_WIDTH,
      height: this.DEFAULT_WIDTH / 2,
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
        this.selectedShapeSubject.next(e.target as Konva.Shape);
      } else {
        tr.setNodes([]);
        this.selectedShapeSubject.next(undefined);
      }
      this.getMainLayer().draw();
    });
  }

  static moveNodes(
    node: Konva.Node,
    newRatio: number,
    oldRatio: number,
    newStageSize: { width: number; height: number }
  ): void {
    if (node.getChildren().length > 0) {
      node.getChildren().each((childNode) => {
        CanvaService.moveNodes(childNode, newRatio, oldRatio, newStageSize);
      });
    }

    if (node.getType() === 'Shape' && node.name() !== 'cadre') {
      const nodeOrig = node.getPosition();
      const nodeSize = {
        width: node.size().width * node.scaleX(),
        height: node.size().height * node.scaleY(),
      };

      if (nodeOrig.y + nodeSize.height > newStageSize.height) {
        let newY =
          nodeOrig.y - (nodeOrig.y + nodeSize.height - newStageSize.height);
        newY = newY < 0 ? 0 : newY;
        node.setAttr('y', newY);
      }
    }
  }

  changeSize(cardSize: { width: number; height: number }) {
    this.cardSize = cardSize;
    const sizeRatio = cardSize.width / cardSize.height;

    this.unselectAll();
    const currentSize = this.stage.size();
    const size = {
      width: currentSize.width,
      height: currentSize.width / sizeRatio,
    };
    this.stage.size(size);
    CanvaService.moveNodes(
      this.stage,
      sizeRatio,
      currentSize.width / currentSize.height,
      size
    );
    this.stage.findOne('.cadre').setAttrs(size);
    this.getMainLayer().draw();
  }

  displayCanva(domElem: HTMLElement): void {
    const sizeRatio = this.cardSize.width / this.cardSize.height;
    const size = {
      width: domElem.clientWidth,
      height: domElem.clientWidth / sizeRatio,
    };
    this.stage.size(size);
    this.stage.findOne('.cadre').setAttrs(size);
    this.getMainLayer().draw();
    domElem.appendChild(this.container);
  }

  getStage() {
    return this.stage;
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
      fill: Helpers.getRandomHexColor(),
      stroke: Helpers.getRandomHexColor(),
      strokeWidth: Helpers.getRandomInt(4),
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

  addImg(imageElem: HTMLImageElement): void {
    const img = new Konva.Image({
      x: Helpers.getRandomInt(this.stage.size().width - imageElem.clientWidth),
      y: Helpers.getRandomInt(
        this.stage.size().height - imageElem.clientHeight
      ),
      image: imageElem,
      width: imageElem.clientWidth,
      height: imageElem.clientHeight,
      draggable: true,
    });

    // add the shape to the layer
    this.getMainLayer().add(img).batchDraw();
  }

  unselectAll(): void {
    const tr: Konva.Transformer | undefined = this.stage.findOne(
      'Transformer'
    ) as Konva.Transformer;
    if (tr !== undefined) {
      tr.setNodes([]);
      this.selectedShapeSubject.next(undefined);
    }
  }

  /**
   * Impression PDF de la première page des data
   *
   * @param data
   * @param printMargin
   * @param internalMargin
   * @returns PDF en dataURI
   */
  getPDFPreview(data: keyValue[], printMargin: number, internalMargin: number) {
    return this.generatePDF(data, printMargin, internalMargin, true).output(
      'datauristring'
    );
  }

  /**
   * Impression PDF des data
   *
   * @param data
   * @param printMargin Marges d'impression (externes)
   * @param internalMargin Marges entre les cartes (interne)
   * @returns Un nouvel onglet avec le PDF
   */
  exportToPDF(
    data: keyValue[],
    printMargin: number,
    internalMargin: number
  ): void {
    this.generatePDF(data, printMargin, internalMargin).output(
      'dataurlnewwindow'
    );
  }

  getCardSize() {
    return this.cardSize;
  }

  private generatePDF(
    data: keyValue[],
    printMargin: number,
    internalMargin: number,
    preview = false
  ): jsPDF {
    const PAPER_SIZE = { width: 210, height: 297 }; // A4

    // On cherche le nombre de carte qu'on peut placer sur une ligne
    let max_col = 0;
    while (
      2 * printMargin +
        this.cardSize.width +
        (internalMargin + this.cardSize.width) * max_col <
      PAPER_SIZE.width
    ) {
      max_col++;
    }
    if (max_col === 0) {
      throw new Error('Carte trop large');
    }

    // On cherche le nombre de carte qu'on peut placer sur une colonne
    let max_line = 0;
    while (
      2 * printMargin +
        this.cardSize.height +
        (internalMargin + this.cardSize.height) * max_line <
      PAPER_SIZE.height
    ) {
      max_line++;
    }
    if (max_line === 0) {
      throw new Error('Carte trop haute');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');

    if (data.length === 0) {
      pdf.text('Missing imported data', printMargin, printMargin);
      return pdf;
    }

    let dataIndex = 0; // L'index de la data en cours d'affichage dans la carte

    this.unselectAll();

    // Breaké si on est à la fin de importedData ou page1
    while (true) {
      for (let i = 0; i < max_col && dataIndex < data.length; i++) {
        for (let j = 0; j < max_line && dataIndex < data.length; j++) {
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
            printMargin + (internalMargin + this.cardSize.width) * i,
            printMargin + (internalMargin + this.cardSize.height) * j,
            this.cardSize.width,
            this.cardSize.height
          );
          dataIndex++;
        }
      }
      if (dataIndex < data.length && !preview) {
        pdf.addPage('a4', 'p');
      } else {
        break;
      }
    }

    return pdf;
  }
}
