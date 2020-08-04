import './style/style.css';

import { 
    pxCount, drawTo, autoUpdate,
    count, expr,
    container, canvas, ctx, svgElm,
} from './global.js';

import { 
    DrawStatusManager, UpdateStatusManager, GenSVGStatusManager
} from './StatusManager.js';

import { 
    getSettings, getViewBox
} from './coorManager.js';

import graphUtils from './graphUtils.js';
import coorm from "./coorManager.js";
import svgToImage from './svgToImage.js';

const drawStatus = new DrawStatusManager();
const updateStatus = new UpdateStatusManager();
const genSVGstatus = new GenSVGStatusManager();

let graphObjs = [];

for (let i = 0; i < 20; i++) {
    graphObjs.push(new graphUtils.func(i + `*(${expr.value})`));
}

function init() {
    window.w = container.clientWidth; window.h = container.clientHeight;
    transMatrix = ([
        20, 0, 0,
        0, -20, 0,
        w / 2, h / 2, 1
    ]);

    if(drawTo === 'canvas'){
        svgElm.remove();
    }else{
        canvas.remove();
    }

    let __svg = {
        html: "",
        getOuterHTML() {
            let dm = difference(transMatrix, this.settings.m);
            return `<svg width="${w}" height="${h}" viewBox="${getViewBox(dm)}" xmlns="http://www.w3.org/2000/svg">${this.html}</svg>`;
        },
        settings: getSettings()
    };
    Object.defineProperty(window, 'svg', {
        get() {
            return __svg;
        },
        set(v) {
            __svg = v;
        }
    });
}

let a = 1;

function generateSVG(s) {
    if (genSVGstatus.isAllowed()) {
        genSVGstatus.generating();
        //////////////
        ////////
        let html = '';
        for (let obj of graphObjs) { html += obj.generateHtml(s); }
        ////////
        //////////////
        svg.html = html;
        svg.settings = s;
        
        genSVGstatus.generated();
    }
}

async function update(force = false) {

    if (autoUpdate || force) {
        if (updateStatus.isAllowed()) {
            updateStatus.updating();
            let s = getSettings();

            // await timeout(200);
            generateSVG(s);
            draw();
            if (updateStatus.isReAllowed()) {
                updateStatus.updated();
                update(...updateStatus.reupdateArgs);
            }
            updateStatus.updated();

        } else if (updateStatus.is(updateStatus.UPDATING)) {
            updateStatus.reupdate(arguments);
        }
    }
}

export function draw() {
    if (drawStatus.isAllowed()) {
        drawStatus.drawing();

        if (drawTo === 'canvas'){
            svgToImage(svg.getOuterHTML(), image => {
                canvas.width = w * devicePixelRatio; canvas.height = h * devicePixelRatio;
                // ctx.clearRect(0,0,w,h);
                ctx.drawImage(image, 0, 0, w, h);
                if (drawStatus.isReAllowed()) {
                    drawStatus.drawed();
                    draw(...drawStatus.redrawArgs);
                }
                drawStatus.drawed();
            });
        }else{
            container.innerHTML = svg.getOuterHTML();
            if (drawStatus.isReAllowed()) {
                drawStatus.drawed();
                draw(...drawStatus.redrawArgs);
            }
            drawStatus.drawed();
        }

    } else if (drawStatus.is(drawStatus.DRAWING)) {
        drawStatus.redraw(arguments);
    }
}

function timeout(ms) { //pass a time in milliseconds to this function
    return new Promise(resolve => setTimeout(resolve, ms));
}

function difference(a, b) {
    return [
        a[0] / (b[0] || 1), a[1] / (b[1] || 1), 0,
        a[3] / (b[3] || 1), a[4] / (b[4] || 1), 0,
        a[6] - b[6] + w / 2, a[7] - b[7] + h / 2, 1
    ];
}

//#region translation, change origin position

let ismousedown = false;
let mouse;

container.onmousedown = (e) => {
    document.body.style.userSelect = "none";
    ismousedown = true;
    mouse = { x: e.x, y: e.y };
};

window.onmouseup = () => {
    document.body.style.userSelect = "select";
    ismousedown = false;
};

window.onmousemove = (e) => {
    if (ismousedown) {
        let v = { x: e.x - mouse.x, y: e.y - mouse.y };
        // let a = svg.getAttribute('viewBox').split(' ');
        coorm.translate(v.x, v.y);
        mouse = { x: e.x, y: e.y };
        draw();
        update();

    }
};

//#endregion

//#region changing expresion or resilution or w or h

count.onchange = () => {
    let span = document.querySelector("#count + span");
    span.innerText = count.value + " per " + pxCount;
    draw();
    update(true);
};

expr.onchange = () => {
    graphObjs[0].expr = eval(`x=>${expr.value}`);
    draw();
    update(true);
};

window.onresize = () => {
    coorm.translate(container.clientWidth - w, container.clientHeight - h);
    w = container.clientWidth; h = container.clientHeight;
    draw();
    update();
};

//#endregion

window.onload = ()=>{
    init();
    window.onresize();
    if (!autoUpdate) update();
};

