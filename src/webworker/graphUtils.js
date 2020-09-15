import svgUtils from './svgUtils.js';
import * as GraphUtilsBase from '../GraphUtilsBase.js';

export class func extends GraphUtilsBase.func {

  constructor(graphManager, props) {
    super(props);
    this.gm = graphManager;
    this.path = new svgUtils.path(this.pen);
  }

  update() {


    this.path.d = "";
    var transform = this.gm.coorm.transform, vp = this.gm.settings.vp;
    var s = this.gm.settings.drawingStep,
      x = vp.xmin;
    var point1, point2, point3;
    this.path.beginPath();


    let checkPoint = (p1, p2, p3)=>{
      if (p2) {
        if (
          !isNaN(p1[0]) && !isNaN(p1[1]) &&
          p1[1] < 2000 && p1[1] > -2000 && !(
            (p2[1]-p3[1]) * (p1[1]-p2[1]) < 0 &&
            Math.abs(this.dydx(x)) > 1
          ) && true
        ) {
          if ((p1[0]-p3[0])**2 + (p1[1]-p3[1])**2 > 2) {
            return true;
          } else {
            return 1;
          }
        } else {
          return false;
        }
      } else {
        if (!isNaN(p1[0]) && !isNaN(p1[1]) && p1[1] < 2000 && p1[1] > -2000) {
          return true;
        } else {
          return false;
        }
      }
    }

    let doable = true;
    let _do = () => {
      if (x < vp.xmax) {
        x += s;
        point3 = transform(x, this._expr(x));
        x += s;
        point2 = transform(x, this._expr(x));
        if (checkPoint(point3) && checkPoint(point2)) {
          this.path.moveTo(point3[0], point3[1]);
        } else {
          return;
        }

        x += s;
        for (; x < vp.xmax; x += s) {
          point1 = transform(x, this._expr(x));
          switch (checkPoint(point1, point2, point3)) {
            case true:
              this.path.lineTo(point1[0], point1[1]);
              point3 = point2;
              point2 = point1;
              break;
            case 1:
              break;
            case false:
              return;
          }
        }
      }
      doable = false;
    };

    while (doable) {
      _do();
    }

    return this.path.endPath(false);
  }

}

export default {
  func,
};