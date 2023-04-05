<div align="center">

# 📦 turbowarp-ts-plugin

#### Turbowarp dev extension plugin
#### Turbowarp 开发环境扩展插件

</div>

## 简介
turbowarp-ts-plugin是一个高效开发turbowarp扩展的插件, 提供:
- 🎈 **更简介的语法**
- 🔨 **更好的开发环境**
- 📦  **自动补全**
- 🌀 **webpack极致压缩大小**
- ✨ **Typescript支持**

## 开发
1. 初始化安装依赖 (npm, yarn同理)
    ```commandline
    pnpm install
    ```
2. 入口示例 [**/src/index.ts**](/src/index.ts) (javascript同理)
3. 打包生成
    ```commandline
    webpack
    ```

## 接口

示例
```typescript
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
```

1. `id`是表示此扩展使用的唯一id的字符串它应该只包含字符a-z和0-9 **（同一个扩展应该始终使用相同的ID，因为更改它会破坏现有项目）**
2. `name`是一个字符串，告诉Scratch在侧栏中显示什么名称
3. `color1`是一个hex格式的颜色，将设置为扩展的方块颜色
4. `blocks`是定义扩展包含哪些积木的对象列表 
   - `opcode`是积木的内部名称，也对应于积木运行时默认将调用的方法*_(可选`func`覆盖调用的方法名, 已弃用)_
     - **opcode不应该被更改**
   - `blockType` 定义积木的类型
       - `Scratch.BlockType.REPORTER` 圆形的带返回值的积木
       - `Scratch.BlockType.BOOLEAN` 六边形的返回布尔值的积木
       - `Scratch.BlockType.COMMAND` 一个键积木
   <br><br>
   - 
   - `text` 是一个字符串，用于定义积木在编辑器中的名称 格式为 **[参数:类型]**
     - `参数` 定义积木接受的参数的对象, 可能将在`default`和`menu`字段中引用
     - `类型`定义要创建的输入形状
     - 请注意，无论此处设置的`类型`是什么，实际传递给积木的值都不能保证转换为正确的类型例如，您应该手动将参数转换为数字，因为它们通常会作为字符串传递
         - `STRING` 字符串类型
         - `NUMBER` 用于数字输入
         - `BOOLEAN` 用于布尔输入 **(默认值将被忽略)**
         - `ANGLE` 用于角度
         - `COLOR` 颜色类型(hex格式, *如#fff*)
         - `MATRIX` 5x5矩阵（以11101010101…字符串格式传递）
         - `NOTE` 用于音乐
   - default 是参数的初始值, 接受一个字典, 键对应`参数`, 值对应参数的`默认值`
    


## 为什么要写此插件

举一个非常简单的例子

> 原生 turbowarp

```typescript
class DatabaseExtension {
    public getInfo() {
        return {
            id: 'DatabaseExtension',
            name: '云数据库',
            color1: '#00c4ff',
            blocks: [
                {
                    opcode: 'fetchReq',
                    // @ts-ignore
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'fetch [uri:string] 方法[method:string]',
                    arguments: {
                        uri: {
                            // @ts-ignore
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://example.com/',
                        },
                        method: {
                            // @ts-ignore
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'GET',
                        },
                    }
                },
            ],
            menus: {
                method: [
                    "GET", 
                    "POST", 
                    "PUT", 
                    "DELETE",
                ],
            },
        };
    }

    fetchReq({ uri, method }): Promise<any> {
        return fetch(uri, {
            method: method,
        });
    }
}
// @ts-ignore
Scratch.extensions.register(new DatabaseExtension());
```
> turbowarp-ts-plugin

```typescript
import Extension from "./plugin";

new Extension({
    id: 'FetchExtension',
    name: 'fetch',
    color1: '#00c4ff',
    blocks: [
        {
            opcode: 'fetch',
            blockType: Scratch.BlockType.REPORTER,
            text: 'fetch [uri:string] 方法[method:string]',
            default: { uri: "https://example.com/" , method: "GET" },
            menu: { method: ["GET", "POST", "PUT", "DELETE" ] },
            bind: ({ uri, method }): Promise<any> => fetch(uri, { method, }),
        },
    ]
}).register();
```

实际上, 出于文档大小考虑, 这里只节选了一个方块的扩展示例, 那如果是做一个[云数据库](https://gitee.com/LinwinSoft/open-data-api/blob/master/40code/extension.ts)扩展呢? 更大的代码量, 在接口和方法上反复穿行...

所以结合了这一现状, 此插件设计了更好的接口风格, 此插件的总体接口代码量仅占约原生的**40~50%**