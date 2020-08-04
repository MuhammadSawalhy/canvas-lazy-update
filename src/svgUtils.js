class base{
    constructor(type, attr={}){
        this.elm = document.createElement(type);
        this.setAttributes(attr);
        this.type = type;
    }

    get html(){
        return this.elm.outerHTML.slice(0, -4-this.type.length) + '/>';
    }

    setAttributes(attr={}){
        for (let a in attr){
            if (!attr.hasOwnProperty(a)) continue;
            this.elm.setAttribute(a, attr[a]);
        }
    }
}

export class path extends base{
    constructor(attr){
        super("path", attr);
        this.d = "";
    }

    moveTo(x,y){
        this.d += `M${x},${y} `;
    }
    lineTo(x,y){
        this.d += `L${x},${y} `;
    }
    endPath(close){
        if(close) this.d += "z";
        this.elm.setAttribute("d", this.d);
    }
}

export default {
    path,
};