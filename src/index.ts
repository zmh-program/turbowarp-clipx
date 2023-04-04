import { Extension, register } from "./plugin";

register(new Extension({
    id: "ExampleExtension",
    name: "example",
    color1: "#0800ff",
    blocks: [
        {},
    ]
}))
