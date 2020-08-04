

export const pxCount = 100;
export const autoUpdate = true;
export const drawTo = 'canvas';

export const count = document.getElementById('count');
export const expr = document.getElementById('expr');

export const container = document.getElementsByClassName('container')[0];
export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');
export const image = new Image();

export function createElement(html){
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
}

export const svgElm = document.querySelector('svg');

export default {
    
    pxCount,
    autoUpdate,
    drawTo,
    
    count,
    expr,

    container,
    canvas,
    ctx,
    image,
    svgElm,

    createElement,
};