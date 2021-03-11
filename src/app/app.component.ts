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
    /* try {
      const savedStage = localStorage.getItem('canva');
      if (savedStage !== null) {
        this.stage = Konva.Node.create(savedStage, this.KONVA_CONTRAINER_ID);
      }
    } catch {
      // void
    } */

    // Si le chargement de la save n'a pas fonctionné ou n'existe pas
    if (this.stage === undefined) {
      this.initStage();
    }
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
    this.initStage();
  }

  /* onSave(): void {
    localStorage.setItem('canva', this.stage.toJSON() || '');
  } */

  onExport(): void {
    const pdf = new jsPDF('l', 'px', [
      this.stage.width() || 0,
      this.stage.height() || 0,
    ]);
    pdf.addImage(
      this.stage.toDataURL({ pixelRatio: 2 }) || '',
      0,
      0,
      this.stage.width() || 0,
      this.stage.height() || 0
    );

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
    const containerWidth =
      document.getElementById(this.KONVA_CONTRAINER_ID)?.clientWidth || 400;
    this.stage = new Konva.Stage({
      container: this.KONVA_CONTRAINER_ID,
      width: containerWidth,
      height: 400,
    });

    this.stage.on('click', (e) => {
      if (this.transformer !== undefined) {
        this.transformer.destroy();
      }
      if (e.target.getType() === 'Shape') {
        this.transformer = new Konva.Transformer({
          nodes: [e.target],
        });
        this.layer.add(this.transformer);
      }
      this.layer.draw();
    });

    // add canvas element
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.layer.draw();
  }
}
