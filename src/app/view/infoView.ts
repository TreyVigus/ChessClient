import { Color } from "../game/models";

export function displayTurn(color: Color) {
    const p = getParagraph();
    if(color === 'white') {
        p.innerText = 'Turn: white';
    } else {
        p.innerText = 'Turn: black';
    }
}

export function displayVictor(winner: Color) {
    const p = getParagraph();
    if(winner === 'white') {
        p.innerText = 'You win!';
    } else {
        p.innerText = 'You lose!';
    }
}

function getParagraph(): HTMLParagraphElement {
    const infoContainer: HTMLDivElement = document.querySelector('.info')!;
    const oldP = infoContainer.querySelector('p');
    if(oldP) {
        return oldP;
    }

    const newP = document.createElement('p');
    infoContainer.appendChild(newP);
    return newP;
}