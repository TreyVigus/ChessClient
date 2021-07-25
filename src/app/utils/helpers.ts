import { Color, Position } from "../game/models.js";

export function oppositeColor(color: Color): Color {
    if(color === 'white') {
        return 'black';
    }
    return 'white';
}

export function posColor(pos: Position): Color {
    const evenRow = pos[0] % 2 === 0;
    const evenCol = pos[1] % 2 === 0;
    if(evenRow) {
        return evenCol ? 'white' : 'black';
    } else {
        return evenCol ? 'black' : 'white';
    }
}