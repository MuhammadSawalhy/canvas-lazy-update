export default function getCoorManager(m, r){
    return {
        transform(x, y) {
            x = m[0] * x + m[1] * y + m[2];
            y = m[3] * x + m[4] * y + m[5];
            return [x, y];
        },
        
        reverse(x, y) {
            x = r[0] * x + r[1] * y + r[2];
            y = r[3] * x + r[4] * y + r[5];
            return [x, y];
        },
    };
}
