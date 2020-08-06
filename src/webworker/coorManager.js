export default function getCoorManager(m, r){
    return {
        transform(x, y) {
            x = m[0] * x + m[3] * y + m[6];
            y = m[1] * x + m[4] * y + m[7];
            return {x, y};
        },
        
        reverse(x, y) {
            x = r[0] * x + r[3] * y + r[6];
            y = r[1] * x + r[4] * y + r[7];
            return {x, y};
        },
    };
}
