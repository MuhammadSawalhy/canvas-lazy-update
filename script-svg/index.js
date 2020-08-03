import graphUtils from './graphUtils.js';
import coorm from "./coorManager.js";
import { debug, count, expr, pxCount, container, canvas, ctx, svg } from './global.js';
import svgToImage from './svgToImage.js';
import { DrawStatusManager, UpdateStatusManager } from './StatusManager.js';

export const drawStatus   = new DrawStatusManager();
export const updateStatus = new UpdateStatusManager();
export const genSVGstatus = new GenSVGStatusManager();

export let graphObjs    = [new graphUtils.func(expr.value)];

function init() {
    window.w = container.clientWidth; window.h = container.clientHeight;
    transMatrix = ([
        20, 0, 0,
        0, -20, 0,
        w / 2, h / 2, 1
    ]);
}

function generateSVG() {
    if(genSVGstatus.isAllowed()){
        genSVGstatus.generating();
        coorm.changable = false;

        //////////////
        ////////
        let html = '';
        for (let obj of graphObjs) { html += obj.generateHtml(); }
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);
        svg.innerHTML = html;
        ////////
        //////////////

        coorm.changable = true;
        genSVGstatus.generated();
        return svg.outerHTML;
    }
}

function draw(_svg) {
    if (drawStatus.isAllowed()) {
        drawStatus.drawing();
        svgToImage(_svg, (image) => {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(image, 0, 0, w, h);
            if (drawStatus.isReAllowed()){
                drawStatus.drawed();
                draw();
            }
            drawStatus.drawed();
        });
    } else if(status.is(status.DRAWING)){
        status.redraw();
    }
}

async function update(){
    if(updateStatus.isAllowed()){
        updateStatus.updating();

        //#region 
        draw(generateSVG());
        //#endregion
        
        if(update.isReAllowed()){
            updateStatus.updated();
            update();
        }
        updateStatus.updated();
    } else if (updateStatus.is(updateStatus.UPDATING)){
        updateStatus.reupdate();
    }
}

function getViewBox(m){
    m = m || transMatrix;
    return `${-m[6]} ${-m[7]} ${~~(w/m[0])} ${~~(h/m[4])}`;
}

count.onchange = () => {
    let span = document.querySelector("#count + span");
    span.innerText = count.value + " per " + pxCount;
    draw();
};

expr.onchange = ()=>{
    graphObjs[0].expr = eval(`x=>${expr.value}`);
    draw();
};

window.onresize = () => {
    coorm.translate(container.clientWidth - w, container.clientHeight - h);
    w = container.clientWidth; h = container.clientHeight;
    canvas.width = w; canvas.height = h;
    update();
};

let ismousedown = false;
let mouse;

container.onmousedown = (e) => {
    document.body.style.userSelect = "none";
    ismousedown = true;
    mouse = {x: e.x, y: e.y};
};

window.onmouseup = () => {
    document.body.style.userSelect = "select";
    ismousedown = false;
};

window.onmousemove = (e) => {
    if (ismousedown) {
        let v = {x: e.x - mouse.x, y: e.y - mouse.y};
        // let a = svg.getAttribute('viewBox').split(' ');
        coorm.translate(v.x, v.y);
        mouse = {x: e.x, y: e.y};
        update();
        draw();
    }
};

///////
// all is setup
///////


init();

window.onresize();
