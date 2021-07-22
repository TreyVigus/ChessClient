import { Color } from "../game/models.js";

export function oppositeColor(color: Color): Color {
    if(color === 'white') {
        return 'black';
    }
    return 'white';
}