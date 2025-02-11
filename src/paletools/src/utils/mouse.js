import getWindow from "../services/window";

export function dispatchMouseEvent(target, eventName) {
    if(!target) return false;

    const mouseEvent = new MouseEvent(eventName, {
        bubbles: true,
        cancelable: true,
        view: getWindow()
    });
    target.dispatchEvent(mouseEvent);
    return true;
}

export function mouseDown(target){
    return dispatchMouseEvent(target, 'mousedown');
}

export function mouseUp(target){
    return dispatchMouseEvent(target, 'mouseup');
}

export default function mouseClick(target, delay){
    if (delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mouseClick(target));
            }, delay);
        });
    }
    else {
        return mouseDown(target) && mouseUp(target);
    }
}