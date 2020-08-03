import coorm from "./coorManager.js";
import svgUtils from './svgUtils.js';
import {pxCount, count} from './global.js';


export class func{
    constructor(expr, pen){
        pen = {'stroke': 'white', 'stroke-width': 2, 'fill': 'none', ...(pen || {})};
        this.expr = eval(`(x) => ${expr}`);
        this.pen = pen;
        this.path = new svgUtils.path(pen);
    }

    generateHtml(){
        this.path.d = "";
        let point = coorm.reverse(0, 0);
        point = coorm.transform(point.x, this.expr(point.x));
        this.path.moveTo(point.x, point.y);
        let n = count.value*w/pxCount;
        for (let i = 1; i < n; i++) {
            point = coorm.reverse(i/n*w, 0);
            point = coorm.transform(point.x, this.expr(point.x) );
            this.path.lineTo(point.x, point.y);
        }
        this.path.endPath(false);
        return this.path.html;
    }
}

export default {
    func,
};