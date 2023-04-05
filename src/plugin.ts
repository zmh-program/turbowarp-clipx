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
            if ( block.menu && Object.keys(Object(block.menu)).length ) {
                for (const name in block.menu) this.menus[name] = { items: block.menu[name] };
            }

            const args: RegExpExecArray | null = /\[\S*:\S*]/i.exec(block.text);

            this.blocks.push(cleanObject({
                opcode: block.opcode,
                blockType: block.blockType,
                text: block.text,
                arguments: args?.map((arg: string): Record<string, any> => {
                    const [ variable, type ]: string[] = arg.slice(1, -1).split(":");
                    block.text.replace(arg, `[${variable}]`);
                    return cleanObject({
                        type: Scratch.blockType[type],
                        default: block.default ? block.default[variable] : undefined,
                        menu: block.menu ? block.menu[variable] : undefined,
                    });
                })
            }));
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
