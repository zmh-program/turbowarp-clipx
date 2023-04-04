import Scratch from "scratch-vm-extension";
export class AbstractExtension {
    constructor() {
    }
}

export function register(extension: AbstractExtension) {
    Scratch.extensions.register(<Scratch.Extension>extension);
}