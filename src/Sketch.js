import { workerActions } from './config.js';
import { svgWorker } from './global.js';
import CoorManager from "./CoorManager.js";
import { getTransform } from './CoorManager.js';
import { DrawStatusManager, UpdateStatusManager } from './StatusManager.js';


export default class Sketch {

  constructor(ctx) {
    this.ctx = ctx;

    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    this.coorm = new CoorManager([
      20, 0,  w/2,
      0, -20, h/2,
      0, 0, 1
    ], w, h);

    this.children = [];
    this.children.settings = this.coorm.settings;

    this.coorCanvas = document.createElement('canvas');
    this.coorCtx = this.coorCanvas.getContext('2d');

    this.autoUpdate = true;

    this.drawStatus = new DrawStatusManager();
    this.updateStatus = new UpdateStatusManager();

  }

  getChildren(id) {
    for (let c of this.children) {
      if (c.id === id) {
        return c;
      }
    }
  }

  addChildren(c){
    c.sketch = this;
    c.coorm = this.coorm;
    this.children.push(c);
  }

  update(force = false) {
    if (this.autoUpdate || force) {
      if (this.updateStatus.isAllowed()) {
        this.updateStatus.updating();

        svgWorker.postMessage({ action: workerActions.UPDATE, settings: this.coorm.settings });

      } else if (this.updateStatus.is(this.updateStatus.UPDATING)) {
        this.updateStatus.reupdate(arguments);
      }
    }
  }

  draw() {
    if (this.drawStatus.isAllowed()) {
      this.drawStatus.drawing();
      let dm = this.coorm.difference(this.children.settings.r, true);
      this.children.settings.dm = dm;

      let trans = getTransform(dm, true);
      this.ctx.canvas.width = this.coorm.w; this.ctx.canvas.height = this.coorm.h;
      this.drawCoor();
      this.ctx.setTransform(...trans);
      for (let c of this.children) {
        c.draw(this.ctx);
      }
      if (this.drawStatus.isReAllowed()) {
        this.drawStatus.drawed();
        requestAnimationFrame(this.draw.apply(this, this.drawStatus.redrawArgs));
      } else {
        this.drawStatus.drawed();
      }

    } else if (this.drawStatus.is(this.drawStatus.DRAWING)) {
      this.drawStatus.redraw(arguments);
    }
  }

  drawCoor() {
    let vp = this.coorm.vp;

    this.coorCanvas.width = this.coorm.w; this.coorCanvas.height = this.coorm.h;
    let line = (x1, y1, x2, y2, transed = true) => {
      if (!transed) {
        let p1 = this.coorm.transform(x1, y1);
        x1 = p1[0]; y1 = p1[1];
        let p2 = this.coorm.transform(x2, y2);
        x2 = p2[0]; y2 = p2[1];
      }
      this.coorCtx.beginPath();
      this.coorCtx.moveTo(x1, y1);
      this.coorCtx.lineTo(x2, y2);
      this.coorCtx.strokeStyle = 'rgb(0,0,0)';
      this.coorCtx.stroke();
    }

    line(vp.xmin, 0, vp.xmax, 0, false); // x-axis
    line(0, vp.ymin, 0, vp.ymax, false); // y-axis

    this.ctx.drawImage(this.coorCanvas, 0, 0);
  }

}