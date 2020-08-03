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

    generateHtml(s){
        this.path.d = "";
        let point = coorm.transform(s.vp.xmin, this.expr(s.vp.xmin), s.m); 
        this.path.moveTo(point.x, point.y);
        let n = count.value*w/pxCount;
        for (let i = 1; i < n; i++) {
            var x = i/n * s.vp.xwidth + s.vp.xmin;
            point = coorm.transform(x, this.expr(x), s.m); 
            this.path.lineTo(point.x, point.y);
        }
        this.path.endPath(false);
        return this.path.html;
    }

}

export default {
    func,
};