/// <reference path="../types.d.ts" />

import source from '../i18n/source.json'
import { clean, translate } from './utils'
import Cache from './cache'
import type { Option, Block } from './option'
import { commonjs } from "./env"

type ScratchBlockHandler = (args: { [key: string]: any }) => any;
type Menus = Record<string, { items: any[] }>;
type ExtensionSpecAttrs = Option | Cache | Menus;
type ExtConstructor = (option: Option) => void;
type ExtGetBlock = (block: Block) => Scratch.Block;
type ExtGetInfo = () => Scratch.Info;
type ExtRegister = () => void;
type ExtensionSpecMethods = ExtConstructor | ExtGetBlock | ExtGetInfo | ExtRegister;
type ExtensionSpecs = ExtensionSpecAttrs | ExtensionSpecMethods;

export default class Extension {
  protected option: Option;
  protected menus: Menus;
  protected cache: Cache;

  [key: string]: ExtensionSpecs | ScratchBlockHandler;

  public constructor(option: Option) {
    this.option = option;
    this.cache = new Cache(option.uptime, option.debug);
    this.menus = {};

    if (commonjs) {
      import('../i18n/generate').then((module) => {
        const blocks: Record<string, string> = { title: option.name || "" };
        for (const block of option.blocks) blocks[block.opcode] = block.text;
        module.process_i18n(blocks, option.i18n || {}).then(() => 0);
      });
    } else {
      Scratch.translate.setup(source as Scratch.translate.Translation);
    }
  }


  private getBlock(block: Block): Scratch.Block {
    const cache = block.cache;
    if (cache?.enable) {
      this.cache.register(block.opcode, cache.expiration || 0);
      block.bind = this.cache.cache(block.opcode, block.bind);
    }
    this[block.opcode] = block.bind;
    if ((block.menu != null) && (Object.keys(Object(block.menu)).length > 0)) {
      for (const name in block.menu) this.menus[name] = { items: block.menu[name] };
    }

    const res: RegExpMatchArray | null = block.text.match(/\[\S*:\S*]/ig);
    const args: Record<string, Record<string, any>> = {};
    res?.forEach((arg: string): void => {
      const [variable, type]: string[] = arg.slice(1, -1).split(':');
      block.text = block.text.replace(arg, `[${variable}]`);
      args[variable] = clean({
        type: Scratch.ArgumentType[type.toUpperCase() as keyof typeof Scratch.ArgumentType],
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
    }) as Scratch.Block;
  }

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
    }) as Scratch.Info;
  }

  public register() {
    if (commonjs) return;
    try {
      Scratch.extensions.register(this);
    } catch (e) {
      console.info(`Failed to load extension ${this.option.name}`);
      if (this.option.debug) console.error(e);
    }
  }
}
