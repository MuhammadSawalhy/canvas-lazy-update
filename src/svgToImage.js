import {image} from './global.js';


// export default async function svgToImage(svg, onload){
//     let blob = new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
//     let URL = window.URL || window.webkitURL || window;
//     let blobURL = URL.createObjectURL(blob);
//     image.onload = ()=>{
//         if (onload) onload(image);
//         URL.revokeObjectURL(blobURL);
//     };
//     image.src = blobURL;
    
//     return image;
// }



// export default async function svgToImage(svg, onload){
//     image.onload = ()=>{
//         if (onload) onload(image);
//     };
//     svg = btoa(svg);
//     image.src = `data:image/svg+xml;charset=utf-8,${svg}`;
//     return image;
// }



export default async function svgToImage(svg, onload){
    // http://stackoverflow.com/questions/3768565/drawing-a-svg-file-on-a-html5-canvas
    image.onload = ()=>{
        if (onload) onload(image);
    };
    image.src = `data:image/svg+xml;charset=UTF-8,${svg}`;
    return image;
}






