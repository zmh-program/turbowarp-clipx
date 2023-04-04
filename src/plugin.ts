import VM from "scratch-vm"
export class AbstractExtension {
    constructor() {
    }
}

export function register(extension: AbstractExtension) {
    /** @ts-ignore **/
    Scratch.extensions.register(extension);
}