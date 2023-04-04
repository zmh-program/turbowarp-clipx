import { Scratch } from "./vm";
export class Extension {
    constructor() {
    }

    getInfo() {

    }
}

export function register(extension: Extension) {
    /** @ts-ignore **/
    Scratch.extensions.register(extension);
}