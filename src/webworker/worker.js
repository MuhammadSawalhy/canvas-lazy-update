import graphUtils from './graphUtils.js';
import getCoorm from './coorManager.js';

let config, coorm, settings;
let graphObjs = [];
const graphManager = {};

for (let i = 0; i < 20; i++) {
    graphObjs.push(new graphUtils.func(graphManager, i + `*(Math.sin(x))`));
}

function generateSVG() {
    let html = '';
    for (let obj of graphObjs) { html += obj.generateHtml(); }
    self.postMessage(html);
}

self.addEventListener('message', (msg)=>{
    let {m , r} = msg.data.settings;
    settings = msg.data.settings;
    config = msg.data.config;
    coorm = getCoorm(m, r);
    Object.assign(graphManager, {
        settings,
        config,
        coorm,
    });
    generateSVG();
});
