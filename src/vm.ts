namespace $Scratch {
  namespace ArgumentType {
    const ANGLE = 'angle'
    const BOOLEAN = 'Boolean'
    const COLOR = 'color'
    const IMAGE = 'image'
    const MATRIX = 'matrix'
    const NOTE = 'note'
    const NUMBER = 'number'
    const STRING = 'string'
  }

  namespace BlockType {
    const BOOLEAN = 'Boolean'
    const BUTTON = 'button'
    const COMMAND = 'command'
    const CONDITIONAL = 'conditional'
    const EVENT = 'event'
    const HAT = 'hat'
    const LOOP = 'loop'
    const REPORTER = 'reporter'
  }

  namespace TargetType {
    const SPRITE = 'sprite'
    const STAGE = 'stage'
  }

  interface AngleArgument {
    type: 'angle'
    /**
         * Defaults to 0.
         */
    defaultValue?: string | number
  }
  interface BooleanArgument {
    type: 'Boolean'
  }
  interface ColorArgument {
    type: 'color'
    /**
         * Should be a hex color code. No alpha channel supported. Defaults to random color.
         */
    defaultValue?: string | number
  }
  interface NumberArgument {
    type: 'number'
    /**
         * Defaults to 0.
         */
    defaultValue?: string | number
    menu?: string
  }
  interface StringArgument {
    type: 'string'
    /**
         * Defaults to empty string.
         */
    defaultValue?: string | number
    menu?: string
  }
  interface MatrixArgument {
    type: 'matrix'
    /**
         * Should be a 25 character long string of 1s and 0s.
         * Numbers are technically accepted, but be aware that due to floating point precision, some detail may be lost.
         * Technically optional, but behaves strangely with no default value.
         */
    defaultValue?: string | number
  }
  interface NoteArgument {
    type: 'note'
    /**
         * Defaults to 0 ("C (0)")
         */
    defaultValue?: string | number
  }
  interface ImageArgument {
    type: 'image'
    dataURI: string
    /**
         * Defaults to false.
         */
    flipRTL?: boolean
  }
    type Argument = (
        AngleArgument |
        BooleanArgument |
        ColorArgument |
        NumberArgument |
        StringArgument |
        MatrixArgument |
        NoteArgument |
        ImageArgument
        )

    interface AbstractBlock {
      opcode: string
      func?: string
      text: string | string[]
      arguments?: Record<string, Argument>
      hideFromPalette?: boolean
      filter?: Array<'target' | 'sprite'>
      blockIconURI?: string
    }
    interface BooleanBlock extends AbstractBlock {
      blockType: 'Boolean'
    }
    interface ButtonBlock extends AbstractBlock {
      blockType: 'button'
      func: 'MAKE_A_LIST' | 'MAKE_A_PROCEDURE' | 'MAKE_A_VARIABLE'
    }
    interface CommandBlock extends AbstractBlock {
      blockType: 'command'
      /**
         * Defaults to false.
         */
      isTerminal?: boolean
    }
    interface ConditionalBlock extends AbstractBlock {
      blockType: 'conditional'
      /**
         * Defaults to false.
         */
      isTerminal?: boolean
      /**
         * Defaults to 1.
         */
      branchCount?: number
    }
    interface EventBlock extends AbstractBlock {
      blockType: 'event'
      /**
         * This must be explicitly set to false, otherwise the block will not work.
         * Event blocks cannot be edge activated. Use hat instead.
         */
      isEdgeActivated: false
      /**
         * Defaults to false.
         */
      shouldRestartExistingThreads?: boolean
    }
    interface HatBlock extends AbstractBlock {
      blockType: 'hat'
      /**
         * Defaults to true.
         */
      isEdgeActivated?: boolean
      /**
         * Defaults to false.
         */
      shouldRestartExistingThreads?: boolean
    }
    interface ReporterBlock extends AbstractBlock {
      blockType: 'reporter'
      /**
         * Defaults to false.
         */
      disableMonitor?: boolean
    }
    interface LoopBlock extends AbstractBlock {
      blockType: 'loop'
      /**
         * Defaults to false.
         */
      isTerminal?: boolean
      /**
         * Defaults to 1.
         */
      branchCount?: number
    }
    type Block = (
        BooleanBlock |
        ButtonBlock |
        CommandBlock |
        ConditionalBlock |
        EventBlock |
        HatBlock |
        ReporterBlock |
        LoopBlock
        )

    interface Menu {
      acceptReporters?: boolean
      /**
         * A list of static items in the menu, or the name of the dynamic menu function.
         */
      items: Array<string | {
        text: string
        value: string
      }> | string
    }

    interface Info {
      id: string

      /**
         * Defaults to extension ID if not specified.
         */
      name?: string

      /**
         * Should be a hex color code.
         */
      color1?: string

      /**
         * Should be a hex color code.
         */
      color2?: string

      /**
         * Should be a hex color code.
         */
      color3?: string

      /**
         * Should be a data: URI
         */
      menuIconURI?: string

      /**
         * Should be a data: URI
         */
      blockIconURI?: string

      docsURI?: string

      blocks: Array<Block | string>
      menus?: Record<string, Menu | string[]>
    }

    interface Extension {
      getInfo(): Info
    }

    namespace extensions {
      function register (extensionObject: Extension): void { }
      /**
         * True if the extension is running unsandboxed, otherwise undefined.
         */
      const unsandboxed: undefined | boolean = undefined
    }
}

// @ts-expect-error
export const Scratch = top.Scratch || $Scratch
