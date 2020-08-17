import {mat3} from 'gl-matrix';
import {count} from './global.js';

export function getTransform(m){
    return [m[0], m[3], m[1], m[4], m[2], m[5]];
}

export function getViewport(m, w, h){
    let r = m.inverse || mat3.invert([], m);
    let p1 = transform(0, 0, r),
        p2 = transform(w, 0, r),
        p3 = transform(w, h, r),
        p4 = transform(0, h, r);

    let xmin    = Math.min(p1[0], p2[0], p3[0], p4[0]),
        xmax    = Math.max(p1[0], p2[0], p3[0], p4[0]), 
        ymin    = Math.min(p1[1], p2[1], p3[1], p4[1]),
        ymax    = Math.max(p1[1], p2[1], p3[1], p4[1]), 
        xwidth  = xmax - xmin,
        ywidth  = ymax - ymin;

    return { xmin, xmax, ymin, ymax, xwidth, ywidth };

}

export function getSettings(m, w, h, clone = true) {
    let s = {};
    if (clone) {
        s = {
            vp: getViewport(m, w, h),
            m: [...m],
            r: [...m.inverse],
        };
    } else {
        s = {
            vp: getViewport(m, w, h),
            m: (m),
            r: (m.inverse),
        };
    }

    Object.assign(s, {
        w, h,
        drawingStep: s.vp.xwidth/count.value,
       
    });
    return s;
}

export function transform(x, y, m) {
    x = m[0] * x + m[1] * y + m[2];
    y = m[3] * x + m[4] * y + m[5];
    return [x, y];
}

export function reverse(x, y, m) {
    return transform(x, y, m.inverse || mat3.invert([], m));
}

/**
 * the difference between two transformation matrixes, then a new trans matrix
 * is returned which we can apply after the "b" trans matrix to get the same effect
 * of the "a" trans matrix
 *  mat3(a)*vec3(v) = mat3(returnedMatrix_theDifference)*mat3(b)*vec3(v)
 */
export function difference(a, b, inversed=false) {
    return mat3.multiply(mat3.create(), (inversed ? b : mat3.invert([], b)), a);
}

export class CoorManager{

    constructor(matrix, w, h){
        this.changable = true;
        this.m = matrix;
        this.setSize(w,h);
    }

    get m(){
        return this.__m;
    }

    set m(v){
        if(this.changable){
            this.__m = v;
            this.onchange(!v.inverse);
        }
    }

    get origin(){
        return { x: this.m[2], y: this.m[5] };
    }

    get xAngle(){
        return Math.atan2(this.m[3], this.m[0]);
    }

    get yAngle(){
        return Math.atan2(this.m[4], this.m[1]);
    }

    pipe(){
        this.piping = true;
        return this;
    }

    exec(fn){
        if(this.piping){
            fn();
            return this;
        }
    }

    end(){
        this.piping = false;
        return this.onchange();
    }

    setMatrix(v){
        if(this.changable){
            this.__m = v;
            if(!v.inverse) v.inverse = mat3.invert([], v);
            return this.onchange();
        }
    }

    setSize(w,h){
        if(this.changable){
            this.w = w;
            this.h = h;
            return this.onchange();
        }
    }

    setOrigin(x, y) {
        if(this.changable){
            this.m[2] = x; this.m[5] = y;
            return this.onchange();
        }
    }
    
    translate(x, y) {
        if(this.changable){
            this.m[2] += x; this.m[5] += y;
            return this.onchange();
        }
    }
    
    setScale(xScale, yScale) {
        /**
         * @param x1 x component of the pixel vector of representing i vector (or j vector), the unit vector in the x-axis (or y-axis) direction.
         * @param y1 y component of the pixel vector of representing i vector (or j vector), the unit vector in the x-axis (or y-axis) direction.
         */
        function setVectorScale(x1, y1, scale){
            let angle = Math.atan2(y1, x1);
            let det = scale;
            return {
                x: det * Math.cos(angle),
                y: det * Math.sin(angle)
            };
        }
        if(this.changable){
            let _x = setVectorScale(this.m[0], this.m[3], xScale);
            let _y = setVectorScale(this.m[1], this.m[4], yScale);
            this.m[0] = _x.x; this.m[3] = _x.y;
            this.m[1] = _y.x; this.m[4] = _y.y;
            return this.onchange();
        }
    }
    
    scale(xScalar, yScalar) {
        if(this.changable){
            this.m[0] *= xScalar; this.m[3] *= xScalar;
            this.m[1] *= yScalar; this.m[4] *= yScalar;
            return this.onchange();
        }
    }

    setRotate(xAngle, yAngle){

        /**
         * @param x1 x component of the pixel vector of representing i vector (or j vector), the unit vector in the x-axis (or y-axis) direction.
         * @param y1 y component of the pixel vector of representing i vector (or j vector), the unit vector in the x-axis (or y-axis) direction.
         */
        function setVectorAngle(x1, y1, angle){
            let det = (x1**2 + y1**2)**0.5;
            return {
                x: det * Math.cos(angle),
                y: det * Math.sin(angle)
            };
        }
        
        if(this.changable){
            let _x = setVectorAngle(this.m[0], this.m[3], -xAngle*Math.PI/180);
            let _y = setVectorAngle(this.m[1], this.m[4], -yAngle*Math.PI/180);
            this.m[0] = _x.x; this.m[3] = _x.y;
            this.m[1] = _y.x; this.m[4] = _y.y;
            return this.onchange();
        }

    }

    rotate(xRotationAngle, yRotationAngle){

        /**
         * @param x1 x component of the pixel vector of representing i vector (or j vector), the unit vector in the x-axis (or y-axis) direction.
         * @param y1 y component of the pixel vector of representing i vector (or j vector), the unit vector in the x-axis (or y-axis) direction.
         */
        function rotateVector(x1, y1, rotationAngle){
            let det = (x1**2 + y1**2)**0.5;
            let angle = Math.atan2(y1, x1) + rotationAngle;
            return {
                x: det * Math.cos(angle),
                y: det * Math.sin(angle)
            };
        }

        if (this.changable) {
            let _x = rotateVector(this.m[0], this.m[3], -xRotationAngle*Math.PI/180);
            let _y = rotateVector(this.m[1], this.m[4], -yRotationAngle*Math.PI/180);
            this.m[0] = _x.x; this.m[3] = _x.y;
            this.m[1] = _y.x; this.m[4] = _y.y;
            return this.onchange();
        }

    }

    transform(x,y){
        return transform(x,y,this.m);
    }

    reverse(x,y){
        return reverse(x,y,this.m);
    }
    
    getTransform(){
        return getTransform(this.m);
    }

    difference(){
        return difference(this.m, ...arguments);
    }

    getStrokeWidth(dm, current = 2) {
        let strokeWidthScalar = 1 / (dm[0] ** 2 + dm[3] ** 2) ** 0.5;
        return current * strokeWidthScalar;
    }

    onchange(calcInverse=true){
        if(this.piping){
            return this;
        }else{
            if(calcInverse) this.m.inverse = mat3.invert([], this.m);
            this.settings = getSettings(this.m, this.w, this.h);
            this.vp = this.settings.vp;
        }
    }
    
}

export default CoorManager;
