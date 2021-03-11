import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import jsPDF from 'jspdf';
import { Helpers } from './helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly KONVA_CONTRAINER_ID = 'konva-container';

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  transformer?: Konva.Transformer;

  constructor() {}

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
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
    });

    this.layer.add(box);
    this.layer.draw();
  }

  onAddText(): void {
    const DEFAULT_WIDTH = 200;
    const textNode = new Konva.Text({
      text: 'Some text here',
      x: Helpers.getRandomInt(this.stage.size().width - DEFAULT_WIDTH),
      y: Helpers.getRandomInt(this.stage.size().height - 10),
      fontSize: 20,
      draggable: true,
      //width: DEFAULT_WIDTH,
    });

    this.layer.add(textNode);
    this.layer.draw();
  }

  onClearSave(): void {
    localStorage.removeItem('canva');
    this.layer?.destroy();
    this.stage?.destroy();
    this.initStage();
  }

  onSave(): void {
    localStorage.setItem('canva', this.stage.toJSON() || '');
  }

  onExport(): void {
    const pdf = new jsPDF(); // A4, portrait, mm
    /*'l', 'px', [
      this.stage.width() || 0,
      this.stage.height() || 0,
    ]);*/

    // Target grid : 2 x 3
    // Margin 7mm

    const GRID = { x: 2, y: 5 };
    const MARGIN = 7;
    const RATIO = 0.5; // x/y
    const PAPER_SIZE = { x: 210, y: 297 };

    const maxSizeX = (PAPER_SIZE.x - MARGIN * (GRID.x + 1)) / GRID.x;
    const maxSizeY = (PAPER_SIZE.y - MARGIN * (GRID.y + 1)) / GRID.y;

    let IMG_SIZE = { w: maxSizeX, h: maxSizeX * RATIO };
    if (IMG_SIZE.h > maxSizeY) {
      IMG_SIZE = { w: maxSizeY / RATIO, h: maxSizeY * RATIO };
    }

    const imageData = this.stage.toDataURL({ pixelRatio: 2 }) || '';
    // const imageData = this.stage.toCanvas();
    for (let i = 0; i < GRID.x; i++) {
      for (let j = 0; j < GRID.y; j++) {
        pdf.addImage(
          imageData,
          MARGIN + (MARGIN + IMG_SIZE.w) * i,
          MARGIN + (MARGIN + IMG_SIZE.h) * j,
          IMG_SIZE.w,
          IMG_SIZE.h
        );
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
