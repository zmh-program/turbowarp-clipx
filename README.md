<div align="center">

# ⚡ turbowarp-ts-plugin

#### 📦 Turbowarp dev extension plugin
#### 📦 Turbowarp 开发环境扩展插件

</div>

## 简介
turbowarp-ts-plugin是一个高效开发部署turbowarp扩展的插件, 提供:
- ✨ **更好的接口风格**
- 🔨 **更好的开发环境**
- 📦  **自动补全**
- 🌀 **webpack 极致压缩大小**
- 🎉 **Typescript 支持**

## 开发
1. 初始化安装依赖 (**yarn**, **pnpm**同理)
    ```commandline
    npm install
    ```
2. 入口编写扩展程序 **/src/index.ts** (**javascript**同理)
3. 打包生成
    ```commandline
    webpack
    ```
webpack打包生成的js文件位于**dist/extension.js**

## 接口

**TurboWarp 扩展接口规范** 更多前往[40code扩展开发文档](https://40code.com/#page=post&id=198)
1. `id`是表示此扩展使用的唯一id的字符串应该只包含字符a-z和0-9 **(同一个扩展应该始终使用相同的ID，因为更改它会破坏现有项目)**
2. `name`是一个字符串，告诉Scratch在侧栏中显示什么名称
3. `color1`是一个hex格式的颜色，将设置为扩展的方块颜色
4. `blocks`是定义扩展包含哪些积木的对象列表 
   - `opcode`是积木的内部名称，也对应于积木运行时默认将调用的方法*_(可选`func`覆盖调用的方法名, 已弃用)_
     - **opcode不应该被更改**
   - `blockType` 定义积木的类型
       - `Scratch.BlockType.REPORTER` 圆形的带返回值的积木
       - `Scratch.BlockType.BOOLEAN` 六边形的返回布尔值的积木
       - `Scratch.BlockType.COMMAND` 一个键积木
   - `bind` 接受一个**function**, 允许异步执行返回Promise
   - `text` 是一个字符串，用于定义积木在编辑器中的名称 格式为 **[参数:类型]**
     - `参数` 定义积木接受的参数的对象, 可能将在`default`和`menu`字段中引用
     - `类型`定义要创建的输入形状
         - `STRING` 字符串类型
         - `NUMBER` 用于数字输入
         - `BOOLEAN` 用于布尔输入 **(默认值将被忽略)**
         - `ANGLE` 用于角度
         - `COLOR` 颜色类型(hex格式, *如#fff*)
         - `MATRIX` 5x5矩阵（以11101010101…字符串格式传递）
         - `NOTE` 用于音乐
   - `default` 是参数的初始值, 接受一个字典, 键对应`参数`, 值对应参数的`默认值`
   - `menu` 如果有参数需选择多个给定的值, 则可加入至此参数, 接受一个字典, 键对应`参数`, 值对应多个给定的值的列表类型, 将生成下拉菜单
5. `docsURI`对应文档链接

每太看懂? 下面展示一个示例
```typescript
new Extension({
    id: "ExampleExtension",
    name: "example",
    color1: "#0800ff",
    blocks: [
        {
            opcode: 'output',  /** @ts-ignore */
            blockType: Scratch.BlockType.COMMAND,
            text: '命令 [block:string] [type:string]',
            default: { block : "参数2", type: "类型" },
            menu: { block : [ "参数1", "参数2" ] },
            bind: function({ block, type }) {
                return `内容 ${block} 类型 ${type}`;
            },
        }, {
            opcode: 'list',  /** @ts-ignore */
            blockType: Scratch.BlockType.REPORTER,
            text: '获取一个空列表',
            bind: () => [],
        },
    ]
}).register();
```
上文创建并注册了一个扩展**ExampleExtension**, 并在Scratch中显示为**example**, 方块颜色#0800ff, 并创建了两个方块:

第一个方块*output*的类型为**键积木**, 共有两个参数
1. `block`参数是一个下拉菜单, **字符串**类型, 默认值为*参数2*, 可选值为 *参数1*和*参数2*
2. `type`参数是一个输入框, **字符串**类型, 默认值为*类型*
绑定一个方法返回`内容 {{block}} 类型 {{type}}`

第二个方块*list*的类型为**带返回值的积木**, 方法返回一个空列表

![示例图片](/docs/example.png)

## 为什么要写此插件

举一个非常简单的例子

> 原生 turbowarp

```typescript
class DatabaseExtension {
    public getInfo() {
        return {
            id: 'FetchExtension',
            name: 'fetch',
            color1: '#00c4ff',
            blocks: [
                {
                    opcode: 'fetchReq',
                    // @ts-ignore
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'fetch [uri] 方法[method]',
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

所以结合了这一现状, 此插件借鉴Django路由的传参方式设计了更好的接口风格, 此插件的接口代码量仅占约原生的**30~45%**
