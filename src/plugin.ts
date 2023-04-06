import { cleanObject, notification } from './utils'
import type Option from './option'

export default class Extension {
  protected option: Option
  protected blocks: object[]
  protected menus: Record<string, { items: any[] }>

  public constructor (option: Option) {
    this.option = option
    this.blocks = []
    this.menus = {}

    for (const block of option.blocks) { /** @ts-expect-error */
      this[block.opcode] = block.bind
      if ((block.menu != null) && (Object.keys(Object(block.menu)).length > 0)) {
        for (const name in block.menu) this.menus[name] = { items: block.menu[name] }
      }

      const res: RegExpMatchArray | null = block.text.match(/\[\S*:\S*]/ig)
      const args: Record<string, Record<string, any>> = {}
      res?.map((arg: string): void => {
        const [variable, type]: string[] = arg.slice(1, -1).split(':')
        block.text = block.text.replace(arg, `[${variable}]`)
        args[variable] = cleanObject({ // @ts-expect-error
          type: Scratch.ArgumentType[type.toUpperCase()],
          defaultValue: (block.default != null) ? block.default[variable] : undefined,
          menu: ((block.menu != null) && block.menu[variable]) ? variable : undefined
        })
      })

      this.blocks.push(cleanObject({
        opcode: block.opcode,
        blockType: block.blockType,
        text: block.text,
        arguments: args,
        disableMonitor: block.disableMonitor
      }))
    }
  }

  // @ts-expect-error
  public getInfo (): Scratch.Info {
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
      menus: this.menus
    })
  }

  public register () {
    try {
      // @ts-expect-error
      Scratch.extensions.register(this)
    } catch (e) {
      notification(`Failed to load extension ${this.option.name}`)
      console.error(e)
    }
  }
}
