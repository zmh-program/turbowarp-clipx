// @ts-ignore
import source from '../i18n/source.json'
import { clean, translate } from './utils'
import Cache from './cache'
import type { Option, Block } from './option'
import { commonjs } from "./env"

export default class Extension {
  protected option: Option;
  protected menus: Record<string, { items: any[] }>;
  protected cache: Cache;

  public constructor(option: Option) {
    this.option = option;
    this.cache = new Cache(option.uptime, option.debug);
    this.menus = {};

    if (commonjs) {
      // @ts-ignore
      import('../i18n/generate').then((module) => {
        const blocks: Record<string, string> = { title: option.name || "" };
        for (const block of option.blocks) blocks[block.opcode] = block.text;
        module.process_i18n(blocks, option.i18n || {}).then(() => 0);
      });
    } else {
      // @ts-ignore
      Scratch.translate.setup(source);
    }
  }


  private getBlock(block: Block): object {
    const cache = block.cache;
    if (cache?.enable) {
      this.cache.register(block.opcode, cache.expiration || 0);
      block.bind = this.cache.cache(block.opcode, block.bind);
    }  /** @ts-expect-error */
    this[block.opcode] = block.bind;
    if ((block.menu != null) && (Object.keys(Object(block.menu)).length > 0)) {
      for (const name in block.menu) this.menus[name] = { items: block.menu[name] };
    }

    const res: RegExpMatchArray | null = block.text.match(/\[\S*:\S*]/ig);
    const args: Record<string, Record<string, any>> = {};
    res?.forEach((arg: string): void => {
      const [variable, type]: string[] = arg.slice(1, -1).split(':');
      block.text = block.text.replace(arg, `[${variable}]`);
      args[variable] = clean({ // @ts-expect-error
        type: Scratch.ArgumentType[type.toUpperCase()],
        defaultValue: (block.default != null) ? block.default[variable] : undefined,
        menu: ((block.menu != null) && block.menu[variable]) ? variable : undefined,
      });
    });

    return clean({
      opcode: block.opcode,
      blockType: block.blockType,
      text: translate(block.opcode, block.text),
      arguments: args,
      disableMonitor: block.disableMonitor,
    });
  }

  // @ts-expect-error
  public getInfo(): Scratch.Info {
    return clean({
      id: this.option.id,
      name: translate('title', this.option.name),
      color1: this.option.color1,
      color2: this.option.color2,
      color3: this.option.color3,
      menuIconURI: this.option.menuIconURI,
      blockIconURI: this.option.blockIconURI,
      docsURI: this.option.docsURI,
      blocks: this.option.blocks.map((block: Block): object => this.getBlock({...block})),
      menus: this.menus,
    })
  }

  public register() {
    if (commonjs) return;
    try {
      // @ts-expect-error
      Scratch.extensions.register(this);
    } catch (e) {
      console.info(`Failed to load extension ${this.option.name}`);
      if (this.option.debug) console.error(e);
    }
  }
}
