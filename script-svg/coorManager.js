let m = mat3.create(), r = mat3.create();
Object.defineProperty(window, 'transMatrix', {
    get() {
        return m;
    },
    set(v) {
        m = v;
        mat3.invert(r, m);
    }
});


export default {
    changable: true,

    setOrigin(x, y) {
        if(changable){
            m[6] = x; m[7] = y;
            mat3.invert(r, m);
        }
    },
    
    translate(x, y) {
        if(changable){
            m[6] += x; m[7] += y;
            mat3.invert(r, m);
        }
    },
    
    setScale(x, y) {
        if(changable){
            m[1] = x; m[4] = y;
            mat3.invert(r, m);
        }
    },
    
    scale(x, y) {
        if(changable){
            m[1] *= x; m[4] *= y;
            mat3.invert(r, m);
        }
    },
    
    transform(x, y) {
        x = m[0] * x + m[3] * y + m[6];
        y = m[1] * x + m[4] * y + m[7];
        return {x, y};
    },
    
    reverse(x, y) {
        x = r[0] * x + r[3] * y + r[6];
        y = r[1] * x + r[4] * y + r[7];
        return {x, y};
    },
    
};
