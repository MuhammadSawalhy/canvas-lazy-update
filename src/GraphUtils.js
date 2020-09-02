import * as base from './GraphUtilsBase.js';

export class func extends base.func{
    
    constructor(){
        super(...arguments);
    }

    update(data){
        this.path = new Path2D();
        if(data){
            for (var i=0; i < data.length/2; i++){
                if(data[i*2]){
                    this.path.lineTo(data[i*2], data[i*2+1]);
                }else{
                    i++;
                    this.path.moveTo(data[i*2], data[i*2+1]);
                }
            }
        }
    }

    draw(ctx){
        ctx.strokeStyle = this.pen.stroke;
        ctx.lineWidth = this.coorm.getStrokeWidth(this.sketch.children.settings.dm, this.pen['stroke-width']);
        ctx.stroke(this.path);
    }

}