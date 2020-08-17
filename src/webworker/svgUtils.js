
export class path {

    constructor(){
        this.d = "";
        this.data = new Int32Array();
    }

    beginPath(){
        this.clearData();
    }

    moveTo(x,y){
        let index = this.data.length;
        this.data[index] = NaN;  this.data[index+1] = NaN;  
        this.data[index+2] = x;  this.data[index+3] = y;  
    }

    lineTo(x,y){
        let index = this.data.length;
        this.data[index] = x;  this.data[index+1] = y;  
    }

    trim(a){
        if(a % 1 !== 0){
            return Math.trunc(a) + Math.abs(Math.trunc(a%1*1000))/1000;
        }
        return a;
    }

    endPath(close){
        let index = this.data.length;
        if(close) {
            this.data[index] = this.data[0];
            this.data[index+1] = this.data[1];
        }
        let a = this.data;
        this.clearData();
        return a;
    }

    clearData(){
        this.data = [];
    }

}

export default {
    path,
};

