
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const expr = document.getElementById('expr');
const count = document.getElementById('count');
const pxCount = 100;

let m = mat3.create(), r = mat3.create();
Object.defineProperty(window, 'transMatrix', {
    get() {
        return m;
    },
    set(v) {
        m = v;
        transMatrix.invert = mat3.invert(r, v);
    }
});

function setOrigin({ x, y }) {
    transMatrix[6] = x; transMatrix[7] = y;
}

function translate({ x, y }) {
    transMatrix[6] += x; transMatrix[7] += y;
}

function setScale({ x, y }) {
    transMatrix[1] = x; transMatrix[4] = y;
}

function scale({ x, y }) {
    transMatrix[1] *= x; transMatrix[4] *= y;
}

function transform({ x, y }) {
    let m = transMatrix;
    x = m[0] * x + m[3] * y + m[6];
    y = m[1] * x + m[4] * y + m[7];
    return { x, y };
}

function reverse({ x, y }) {
    let r = transMatrix.invert;
    x = r[0] * x + r[3] * y + r[6];
    y = r[1] * x + r[4] * y + r[7];
    return { x, y };
}

void function init() {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    let w = canvas.width, h = canvas.height;
    transMatrix = ([
        20, 0, 0,
        0, -20, 0,
        w / 2, h / 2, 1
    ]);
}();


function draw() {
    let w = canvas.width, h = canvas.height;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);

    if (expr.value) {
        let fn = eval(`(x)=> ${expr.value}`);
        ctx.beginPath();

        let p = reverse({ x: 0, y: 0 });
        p = transform({ x: p.x, y: fn(p.x) });
        ctx.moveTo(p.x, p.y);
        let n = count.value * w / pxCount;
        for (i = 1; i < n; i++) {
            p = reverse({ x: i / n * w, y: 0 });
            p = transform({ x: p.x, y: fn(p.x) });
            ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}

draw();

count.onchange = () => {
    let span = document.querySelector("#count + span");
    span.innerText = count.value + " per " + pxCount;
    draw();
}

expr.onchange = draw;

canvas.onwheel = (e) => {
    e.preventDefault();
    let zoomIn = Math.sign(e.deltaY) < 0;
    let scalar = Math.sign(e.deltaY) * 0.05 + 1;
    let style = getComputedStyle(canvas);
    let width = style.width.slice(0, -2) * scalar;
    let height = style.height.slice(0, -2) * scalar;
    // canvas.width = width * devicePixelRatio;
    // canvas.height = height * devicePixelRatio;

    canvas.setAttribute("style", `width: ${width}px; height: ${height}px`);
    let w = canvas.width, h = canvas.height;
    // transMatrix = ([
    //  20, 0, 0,
    //  0, -20, 0, 
    //  w/2, h/2, 1
    // ]);
    // draw();
}