import * as base from './GraphUtilsBase.js';

export class func extends base.func{
    
    constructor(){
        super(...arguments);
    }

    draw(ctx){
        if(this.data){
            ctx.beginPath();
            for (var i=0; i < this.data.length/2; i++){
                if(this.data[i*2]){
                    ctx.lineTo(this.data[i*2], this.data[i*2+1]);
                }else{
                    i++;
                    ctx.moveTo(this.data[i*2], this.data[i*2+1]);
                }
            }
            ctx.strokeStyle = this.pen.stroke;
            ctx.lineWidth = this.coorm.getStrokeWidth(this.sketch.children.settings.dm, this.pen['stroke-width']);
            ctx.stroke();
        }
    }

}