import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  stage?: Konva.Stage;
  layer?: Konva.Layer;

  ngOnInit(): void {
    const KONVA_CONTRAINER_ID = 'konva-container';
    const containerWidth = document.getElementById(KONVA_CONTRAINER_ID)
      ?.clientWidth;

    const savedStage = localStorage.getItem('canva');
    if (savedStage !== null) {
      this.stage = Konva.Node.create(savedStage, KONVA_CONTRAINER_ID);
    } else {
      this.stage = new Konva.Stage({
        container: KONVA_CONTRAINER_ID,
        width: containerWidth ?? 400,
        height: 400,
      });

      // add canvas element
      this.layer = new Konva.Layer();
      this.stage.add(this.layer);
      this.layer.draw();
    }
  }

  onAddRect(): void {
    const box = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
    });
    const tr = new Konva.Transformer({
      node: box,
      enabledAnchors: ['bottom-left', 'top-right'],
      boundBoxFunc: (oldBox, newBox) => {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });

    this.layer?.add(box);
    this.layer?.add(tr);
    this.layer?.draw();
  }

  onAddText(): void {
    const textNode = new Konva.Text({
      text: 'Some text here',
      x: 50,
      y: 80,
      fontSize: 20,
      draggable: true,
      width: 200,
      placeholder: 'Some text here',
    });
    this.layer?.add(textNode);
    this.layer?.draw();
    const upperLayer = this.layer;

    textNode.on('dblclick dbltap', () => {
      textNode.hide();
      const textPosition = textNode.absolutePosition();
      console.log(
        textPosition,
        this.stage?.container().offsetLeft,
        this.stage?.container().offsetTop
      );
      const areaPosition = {
        x: (this.stage?.container().offsetLeft || 0) + textPosition.x,
        y: (this.stage?.container().offsetTop || 0) + textPosition.y,
      };
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.value = textNode.text();
      textarea.focus();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + 'px';

      function removeTextarea(): void {
        textarea.parentNode?.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        textNode.show();
        // tr.show();
        // tr.forceUpdate();
        upperLayer?.draw();
      }
      /*function setTextareaWidth(newWidth: number): void {
        /*if (!newWidth) {
          // set width for placeholder
          newWidth = textNode.placeholder.length * textNode.fontSize();
        } /
      } */
      textarea.addEventListener('keydown', (e) => {
        // hide on enter
        // but don't hide on shift + enter
        if (e.key === 'Enter' && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.key === 'Escape') {
          removeTextarea();
        }
      });

      textarea.addEventListener('keydown', (e) => {
        const scale = textNode.getAbsoluteScale().x;
        // setTextareaWidth(textNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + 'px';
      });

      function handleOutsideClick(e: MouseEvent): void {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
      });
    });
  }

  onSave(): void {
    localStorage.setItem('canva', this.stage?.toJSON() || '');
  }

  onExport(): void {
    const pdf = new jsPDF('l', 'px', [
      this.stage?.width() || 0,
      this.stage?.height() || 0,
    ]);
    pdf.setTextColor('#000000');

    // then put image on top of texts (so texts are not visible)
    pdf.addImage(
      this.stage?.toDataURL({ pixelRatio: 2 }) || '',
      0,
      0,
      this.stage?.width() || 0,
      this.stage?.height() || 0
    );

    pdf.output('pdfobjectnewwindow');
  }
}
