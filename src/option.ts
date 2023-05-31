import { Scratch } from './vm'
export default interface Option {
  id: string
  name?: string // Defaults to extension ID if not specified.
  color1?: string // Should be a hex color code.
  color2?: string // Should be a hex color code.
  color3?: string // Should be a hex color code.
  menuIconURI?: string // Should be a data: URI
  blockIconURI?: string // Should be a data: URI
  docsURI?: string // Should be a data: URI
  blocks: Block[]
  debug?: boolean  // Defaults to false if not specified.
  uptime?: number // Timing of cache cleaning. Defaults to 60(secs) if not specified.
}

const $ = Scratch.BlockType
export interface Block {
  opcode: string /** @ts-expect-error */
  blockType: $.BOOLEAN | $.BUTTON | $.COMMAND | $.CONDITIONAL | $.EVENT | $.HAT | $.LOOP | $.REPORTER
  text: string
  cache?: {
    enable?: boolean // If enable caching. Defaults to false if not specified.
    expiration?: number // Cache expiration time (secs). Defaults to 0 (never expire) if not specified.
  }
  bind: (...args: any) => Promise<any> | any
  default?: Record<string, string> // defaultValue
  menu?: Record<string, any[]>
  disableMonitor?: boolean
}
