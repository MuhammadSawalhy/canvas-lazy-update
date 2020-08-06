import {mat3} from 'gl-matrix';

let m = mat3.create(), r = mat3.create();
Object.defineProperty(window, 'transMatrix', {
    get() {
        return m;
    },
    set(v) {
        m = v;
        onchange();
        m.inverse = r;
        window.globalSettings = getSettings();
    }
});

function onchange(){
    mat3.invert(r, m);
}

export function getViewBox(m){
    m = m || transMatrix;
    let _w = Math.abs(w/m[0]), _h = Math.abs(h/m[4]);
    return `${w/2-m[6]} ${h/2-m[7]} ${_w} ${_h}`;
}

export function getViewport(m){

    m = m || transMatrix;

    let _w = w/m[0], _h = h/m[4];

    let xmin    = (-m[6]) / m[0],
        ymin    = (-m[7]) / m[4], 
        xmax    = xmin + _w,
        ymax    = ymin + _h, 
        xwidth  = _w,
        ywidth  = _h;

    let vp  = {
        xmax: Math.max(xmax, xmin),
        xmin: Math.min(xmax, xmin),
        ymax: Math.max(ymax, ymin),
        ymin: Math.min(ymax, ymin),
        xwidth: Math.abs(xwidth),
        ywidth: Math.abs(ywidth),
    };
    
    return vp;
}

export function getSettings(m, clone = true) {
    m = m || transMatrix;
    if (clone) {
        return {
            vp: getViewport(m),
            m: [...m],
            r: [...m.inverse],
        };
    } else {
        return {
            vp: getViewport(m),
            m: (m),
            r: (m.inverse),
        };
    }
}

export default {
    changable: true,

    setOrigin(x, y) {
        if(this.changable){
            m[6] = x; m[7] = y;
            onchange();
        }
    },
    
    translate(x, y) {
        if(this.changable){
            m[6] += x; m[7] += y;
            onchange();
        }
    },
    
    setScale(x, y) {
        if(this.changable){
            m[1] = x; m[4] = y;
            onchange();
        }
    },
    
    scale(x, y) {
        if(this.changable){
            m[1] *= x; m[4] *= y;
            onchange();
        }
    },
    
    transform(x, y, m) {
        m = m||transMatrix;
        x = m[0] * x + m[3] * y + m[6];
        y = m[1] * x + m[4] * y + m[7];
        return {x, y};
    },
    
    reverse(x, y, m) {
        m = m||transMatrix;
        let r = m.inverse;
        x = r[0] * x + r[3] * y + r[6];
        y = r[1] * x + r[4] * y + r[7];
        return {x, y};
    },
    
    getViewBox,
    
    getViewport
};
