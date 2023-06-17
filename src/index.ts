import Extension from './include/plugin'

new Extension({
  id: '',
  name: '',
  color1: '#0800ff',
  blocks: [
    {
        opcode: 'test',
        blockType: 'reporter',
        text: 'put [test:string] message into [temp:string] temperature',
        bind: () => 'test',
    },
    {
        opcode: 'test2',
        blockType: 'reporter',
        text: 'put [test:string] message into [temp:string] temperature',
        bind: () => 'test',
    }
  ]
}).register()
