import coorm from "./coorManager.js";
import svgUtils from './svgUtils.js';


export class func{
    constructor(graphManager, expr, pen){
        pen = {'stroke': 'white', 'stroke-width': 2, 'fill': 'none', ...(pen || {})};
        this.gm = graphManager;
        this.expr = eval(`(x) => ${expr}`);
        this.pen = pen;
        this.path = new svgUtils.path(pen);
    }

    generateHtml(coorm, config){
        this.path.d = "";
        let transform = this.gm.coorm.transform, vp = this.gm.settings.vp;
        let point = transform(vp.xmin, this.expr(vp.xmin)); 
        this.path.moveTo(point.x, point.y);
        let n = this.gm.config.n;
        for (let i = 1; i < n; i++) {
            var x = i/n * vp.xwidth + vp.xmin;
            point = transform(x, this.expr(x)); 
            this.path.lineTo(point.x, point.y);
        }
        this.path.endPath(false);
        return this.path.html;
    }

}

export default {
    func,
};