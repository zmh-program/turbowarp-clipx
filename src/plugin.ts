import { Scratch } from "./vm";
import Option from "./option";

export class Extension {
    protected option: Option;
    constructor(option: Option) {
        this.option = option;
    }

    getInfo(): Scratch.Info {
        return {
            id : this.option.id,
            name: this.option.name,
            color1: this.option.color1,
            color2: this.option.color2,
            color3: this.option.color3,
            menuIconURI: this.option.menuIconURI,
            blockIconURI: this.option.blockIconURI,
            docsURI: this.option.docsURI,
            blocks: (Block | string)[];
            menus: Scratch.Record<string, Scratch.Menu | string[]>;
        }
    }
}

export function register(extension: Extension) {
    /** @ts-ignore **/
    Scratch.extensions.register(extension);
}