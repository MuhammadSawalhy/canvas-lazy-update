
import {
  derivative
} from 'mathjs';

class GraphElement {
  constructor(type, props) {
    this.type = type;
    this.setProps(props);
  }

  get id(){
    return this.__id;
  }

  set id(v){
    this.__id = v;
  }

  setProps(props) {
    Object.assign(this, props);
  }

  objectify() {
    let props = {};
    for (let n of this.propsNames) {
      props[n] = this[n];
    }
    let obj = { type: this.type, props };
    return obj;
  }

}

export class func extends GraphElement {

  constructor(props) {
    super('func', props);
    this.propsNames = ['expr', 'pen'];
    this.expr = props.expr;
    this.pen = { 'stroke': '#C6444199', 'stroke-width': 2, 'fill': 'none', ...(props.pen || {}) };
  }

  get expr() {
    return this.__expr;
  }

  set expr(v) {
    this.__expr = v;
    this._expr = eval(`(x) => ${v}`);
    try{
      this.dydx = eval(`(x) => ${derivative(v ,'x').toString()}`);
    } catch(e) {
      this.dydx = x => (this._expr(x+dx) - this._expr(x)) / dx;
    }
  }

}

export default {
  func,
};
