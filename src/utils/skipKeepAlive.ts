// @ts-ignore
import keepAlive from '../keepAlive';
export function skipKeepAlive(name: any) {
    let old = keepAlive.value;
    let arr = keepAlive.value.split(',');
    let i = arr.indexOf(name);
    if (i !== -1) {
        arr.splice(i, 1);
        keepAlive.value = arr.join();
        setTimeout(() => {
            keepAlive.value = old;
        }, 500);
    }
}
