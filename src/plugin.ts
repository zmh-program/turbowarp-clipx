import { Scratch } from "./vm";
import { cleanObject } from "./utils";
import Option from "./option";

export default class Extension {
    protected option: Option;
    protected blocks: object[];
    protected menus: Record<string, { items: any[] }>;

    public constructor(option: Option) {
        this.option = option;
        this.blocks = [];
        this.menus = {};

        for (const block of option.blocks) {   /** @ts-ignore */
            this[block.opcode] = block.bind;
            if (block.menu) this.handleMenu(block.menu);
            this.blocks.push({
                opcode: block.opcode,
                blockType: block.blockType,
                text: block.text,
                arguments: {

                }
            });
        }
    }

    static compileText(text: string) {
        const args: RegExpExecArray | null = /\[\S*:\S*]/i.exec(text);
        if (args && args.length) {
            for (let arg of args) {
                arg = arg.slice(1, -1);
                const [ variable, type ]: string[] = arg.split(":");
                
            }
        }
    }

    private handleMenu(menu: Record<string, any[]>) {
        if ( Object.keys(Object(menu)).length ) {
            for (const name in menu) {
                this.menus[name] = { items: menu[name] };
            }
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
            blocks: this.blocks,
            menus: this.menus,
        })
    }

    public register() {
        /** @ts-ignore **/
        Scratch.extensions.register(extension);
    }
}
