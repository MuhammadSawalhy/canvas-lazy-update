import './../style.css';

import { count, expr, pxCount, container, autoUpdate, createElement } from './global.js';
import { DrawStatusManager, UpdateStatusManager, GenSVGStatusManager } from './StatusManager.js';
import { getViewport, getViewBox } from './coorManager.js';
import graphUtils from './graphUtils.js';
import coorm from "./coorManager.js";
import svgToImage from './svgToImage.js';

export const drawStatus = new DrawStatusManager();
export const updateStatus = new UpdateStatusManager();
export const genSVGstatus = new GenSVGStatusManager();

export let graphObjs = [];

for(let i = 0; i < 100; i++){
    graphObjs.push(new graphUtils.func(i + `*(${expr.value})`));
}

let __svg = document.getElementsByTagName('svg')[0];

function init() {
    window.w = container.clientWidth; window.h = container.clientHeight;
    transMatrix = ([
        20, 0, 0,
        0, -20, 0,
        w / 2, h / 2, 1
    ]);

    __svg.settings = getSettings();
    Object.defineProperty(window, 'svg', {
        get() {
            return __svg;
        },
        set(v) {
            container.appendChild(v);
            __svg.remove();
            __svg = v;
        }
    });
}

function generateSVG(s) {
    if (genSVGstatus.isAllowed()) {
        genSVGstatus.generating();
        //////////////
        ////////
        let SVG = createElement(`<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>`)
        let html = '';
        for (let obj of graphObjs) { html += obj.generateHtml(s); }
        console.time('d');
        console.log(html.length);
        SVG.innerHTML = html;
        console.timeEnd('d');
        ////////
        //////////////
        let dm = difference(transMatrix, s.m);
        SVG.setAttribute('viewBox', getViewBox(dm));
        SVG.setAttribute('width', w);
        SVG.setAttribute('height', h);
        SVG.settings = s;
        svg = SVG;
        genSVGstatus.generated();
    }
}

export async function update(force = false) {

    if (autoUpdate || force) {
        if (updateStatus.isAllowed()) {
            updateStatus.updating();
            let s = getSettings();

            // await timeout(200);

            setTimeout(()=>{
                generateSVG(s);
                if (updateStatus.isReAllowed()) {
                    updateStatus.updated();
                    update(...updateStatus.reupdateArgs);
                }
                updateStatus.updated();
            }, 0);
            
            
        } else if (updateStatus.is(updateStatus.UPDATING)) {
            updateStatus.reupdate(arguments);
        }
    }
}

export function draw() {
    if (drawStatus.isAllowed()) {
        drawStatus.drawing();
        let dm = difference(transMatrix, svg.settings.m);
        svg.setAttribute('viewBox', getViewBox(dm));
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);

        if (drawStatus.isReAllowed()) {
            drawStatus.drawed();
            draw(...drawStatus.redrawArgs);
        }
        drawStatus.drawed();
    } else if (drawStatus.is(drawStatus.DRAWING)) {
        drawStatus.redraw(arguments);
    }
}

function timeout(ms) { //pass a time in milliseconds to this function
    return new Promise(resolve => setTimeout(resolve, ms));
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

function difference(a, b) {
    return [
        a[0] / (b[0] || 1), a[1] / (b[1] || 1), 0,
        a[3] / (b[3] || 1), a[4] / (b[4] || 1), 0,
        a[6] - b[6] + w / 2, a[7] - b[7] + h / 2, 1
    ];
}

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

///////
// all is setup
///////

init();

window.onresize();
if (!autoUpdate) update(true);
