class base{
    constructor(type, attrs={}){
        this.attrs = attrs;
        this.type = type;
    }

    get html(){
        let attrs = this.getAttributes();
        return `<${this.type} ${attrs}/>`;
    }

    getAttributes(){
        let result = '';
        for (let a in this.attrs){
            result += `${a}="${this.attrs[a]}" `;
        }
        return result;
    } 

}

export class path extends base{
    constructor(attr){
        super("path", attr);
        this.d = "";
    }

    moveTo(x,y){
        this.d += `M${this.trim(x)},${this.trim(y)} `;
    }
    lineTo(x,y){
        this.d += `L${this.trim(x)},${this.trim(y)} `;
    }
    trim(a){
        if(a % 1 !== 0){
            return Math.trunc(a) + Math.abs(Math.trunc(a%1*10))/10;
        }
        return a;
    }
    endPath(close){
        if(close) this.d += "z";
        this.attrs.d = this.d;
    }
    clearData(){
        this.d = '';
        this.attrs.d = this.d;
    }
}

export default {
    path,
};