import graphUtils from './graphUtils.js';
import getCoorm from './coorManager.js';
import * as config from '../config.js';
import setMathToWindow from '../mathAndWindow.js';

let coorm, settings, action;
let graphElements = [];
export const graphManager = {
};

let { workerActions } = config;

setMathToWindow();

function generateSVG() {
    let data = [];
    for (let obj of graphElements) { data.push(obj.update()); }
    self.postMessage({ action , settings, data });
}

self.addEventListener('message', (msg) => {
    action = msg.data.action;
    if (action === workerActions.UPDATE) {
        let { m, r } = msg.data.settings;
        settings = msg.data.settings;
        coorm = getCoorm(m, r);
        Object.assign(graphManager, {
            settings,
            coorm,
        });
        generateSVG();
    } else if (action === workerActions.ADD_GRAPH_ELEMENT) {
        let elm = getGraphElement(msg.data.graphElement);
        graphElements.push(elm);
        self.postMessage({
            action: workerActions.ADD_GRAPH_ELEMENT
        });
    } else if (action === workerActions.EDIT_GRAPH_ELEMENT) {
        let g;
        for (let e of graphElements) {
            if (e.id === msg.data.graphElement.id) {
                g = e;
                break;
            }
        }
        if(!g) throw new Error(`can't edit the graph element "${data.id}"`);
        editGraphElement(g, msg.data.graphElement);
        postMessage({
            action: workerActions.EDIT_GRAPH_ELEMENT
        });
    }
});



function getGraphElement(data) {
    if(data.type === 'func'){
        return new graphUtils.func(graphManager, data.props);
    }
}

function editGraphElement(f, data) {
    f.setProps(data.props);
}
