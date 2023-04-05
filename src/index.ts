import Extension from "./plugin";

new Extension({
    id: "ExampleExtension",
    name: "example",
    color1: "#0800ff",
    blocks: [
        {
            opcode: 'eg',  /** @ts-ignore */
            blockType: Scratch.BlockType.COMMAND,
            text: 'example block [arg:string]',
            default: { arg : "a6" },
            menu: { arg : ["a1", "a6", "a2"] },
            bind: function({ arg }) {
                console.log(arg);
                return arg + " success";
            },
        },
    ]
}).register();
