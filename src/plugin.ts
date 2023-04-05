import { Scratch } from "./vm";
import { cleanObject } from "./utils";
import Option from "./option";

export class Extension {
    protected option: Option;
    constructor(option: Option) {
        this.option = option;
    }

    // @ts-ignore
    getInfo(): Scratch.Info {
        return cleanObject({
            id: this.option.id,
            name: this.option.name,
            color1: this.option.color1,
            color2: this.option.color2,
            color3: this.option.color3,
            menuIconURI: this.option.menuIconURI,
            blockIconURI: this.option.blockIconURI,
            docsURI: this.option.docsURI,
            blocks: this.option.blocks,
            menus: undefined,
        })
    }
}

export function register(extension: Extension) {
    /** @ts-ignore **/
    Scratch.extensions.register(extension);
}