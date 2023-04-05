import Extension from "./plugin";
import {Scratch} from "./vm";

new Extension({
    id: "ExampleExtension",
    name: "example",
    color1: "#0800ff",
    blocks: [
        {
            opcode: 'eg',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'example block [arg:STRING]',
            bind: function({ arg }) {

            }
        },
    ]
}).register();

