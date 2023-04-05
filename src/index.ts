import { Extension, register } from "./plugin";
import {Scratch} from "./vm";

register(new Extension({
    id: "ExampleExtension",
    name: "example",
    color1: "#0800ff",
    blocks: [
        {
            opcode: 'eg',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'example block',
            bind: function({ arg }) {

            }
        },
    ]
}))
