import {image} from './global.js';

export default async function sbgToImage(svg, onload){
    let blob = new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    let URL = window.URL || window.webkitURL || window;
    let blobURL = URL.createObjectURL(blob);
    image.onload = ()=>{
        if (onload) onload(image);
        URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
    
    return image;
}