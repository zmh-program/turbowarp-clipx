import { Scratch } from "./vm";
import { cleanObject } from "./utils";
import Option from "./option";

export class Extension {
    protected option: Option;
    protected blocks: object[];
    protected menus: Record<string, { items: any[] }>;

    public constructor(option: Option) {
        this.option = option;
        this.blocks = [];
        this.menus = {};

        for (const block of option.blocks) {   /** @ts-ignore */
            this[block.opcode] = block.bind;
        }
    }

    // @ts-ignore
    public getInfo(): Scratch.Info {
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