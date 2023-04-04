import type vm from "./types/vm";
vm.register
export class AbstractExtension {
    constructor() {
    }
}

export function register(extension: AbstractExtension) {
    /** @ts-ignore **/
    Scratch.extensions.register(extension);
}