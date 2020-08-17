export default function (){
    let _self = self || window;

    ('sin,cos,tan,floor,ceil,round,abs,log'.split(',')).forEach(f=>{
        _self[f] = Math[f];
    });

    _self.sec = (x) => 1/Math.cos(x);
    _self.csc = (x) => 1/Math.sin(x);
    _self.cot = (x) => 1/Math.tan(x);

    _self.asec = (x) => Math.acos(1/x);
    _self.acsc = (x) => Math.asin(1/x);
    _self.acot = (x) => Math.atan(1/x);

}