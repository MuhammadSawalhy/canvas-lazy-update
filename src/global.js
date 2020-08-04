

export const pxCount = 100;
export const debug = false;

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

export const svg = createElement(`<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>`)

export default {
    
    pxCount,
    debug,
    
    count,
    expr,

    container,
    canvas,
    ctx,
    image,
    svg,

    createElement,
};