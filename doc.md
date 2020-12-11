# 基于 ant-design 的网站主题切换功能的实现

当下，越来越多的网站都提供了主题切换功能。于是，笔者怀着对该功能实现的好奇心，对各个网站进行一番探索，最后总结得出了这些切换主题的方案。笔者当前使用技术栈为 ant-design + react + webpack，故在此基于 ant-design 对网站主题切换功能实现进行介绍。以下为个人实践的一些方案，不对之处，欢迎纠正。

本文介绍的主题切换方案有三种：

- 使用 css 命名空间
- 使用 less 变量
- 动态加载不同的主题文件

特别说明：

> 本文中主题切换只涉及默认主题和暗黑主题的切换，其他多套主题切换的实现，请自行拓展。
> 代码实现只展示主要代码，示例全部代码，见 [github](https://github.com/Erindcl/theme-change-demo)。几个方案之间代码会相互影响，所以在进行单个方案的页面查看时，需要将其他方案的代码注释掉，否则可能无法查看切换效果。

## 最简单的主题切换方案 - 使用 css 命名空间

添加 class 名称，在类名中添加对应主题样式。具体代码实现如下：

```tsx
// src/views/nameSpace.tsx
import * as React from 'react';
import { Radio } from 'antd';
import 'antd/lib/radio/style/index.less'
import '../styles/nameSpace.less';

export default class NameSpace extends React.Component<any, any> {

    state: any = {
        theme: 'default'
    }

    componentDidMount() {}

    onChange = (e: any) => {
        this.setState({
            theme: e.target.value
        })
    }

    render() {
        const { theme } = this.state;
        return (
            // 根据 theme 的值 进行 类名的切换 
            <div className={theme === 'dark' ? 'name-space dark' : 'name-space'}>
                <h3>添加 class 命名空间进行主题切换</h3>
                <div>
                    <span>当前主题：</span>
                    <Radio.Group value={theme} onChange={this.onChange}>
                        <Radio value={'default'}>默认主题</Radio>
                        <Radio value={'dark'}>暗黑主题</Radio>
                    </Radio.Group>
                </div>
            </div>
        )
    }
}
```

```less
// src/styles/nameSpace.less
.name-space {
    padding: 0px 20px;
    background: #f2f7fa;
    height: 100%;
    overflow: hidden;
    // 暗黑主题 样式
    &.dark {
        background: #0e0e17;
        color: #fff;
        .ant-radio-wrapper {
            color: #fff;
        }
        .ant-radio-inner {
            background-color: #11121C;
            border-color: #363B59;
        }
    }
}
```

使用这种方式进行主题切换简单，便于实现，并且通俗易懂。但是需要我们手动编写全部的 css。特别的，antd 组件很多，需要挨个去查找组件类名再进行样式编写覆盖，开发量较大，对于开发量不大的主题样式切换，可以考虑使用该种方式。

## 使用 less 变量

ant-design 官网有提供 [定制主题](https://ant.design/docs/react/customize-theme-cn) 方案。虽然这不能解决我们在线进行主题切换的问题，但是给我们提供了很好的启发，即可以使用 less 提供的 modifyVars 的方式进行覆盖 less 变量。我们需要做的就是调整调用 modifyVars 方法的时机，即在用户点击切换主题的时候调用。并且，需要提供包含主题相关 less 变量及其值的 json。

此外，还有以下两点需要注意：

1. 保证 less 的 modifyVars 方法可以调用，即注册到 window 对象上。
2. 入口 HTML 文件引入的是使用了 less 变量的 less 文件，不能是已经经过 webpack 编译后的 css 文件。

为了保证这两点，需要对模版文件 index.html 进行修改，修改如下：

```html
<!-- src/public/index.html -->
<!DOCTYPE html>
<html lang="zh-cn">

<head>
	<title></title>
    <base href="./" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">
    <meta charset="utf-8">
</head>

<body>
    <div class="root" id="app">
    </div>
    <!-- 使用 less 变量进行主题切换 相关修改 开始 -->
    <!-- 此处引入未经过编译的 antd.less 文件 -->
    <link rel="stylesheet/less" type="text/css" href="public/antd.less" />
    <!-- 添加 less.modifyVars 方法 -->
    <script>
        window.less = {
          async: false,
          env: 'production'
        };
    </script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"></script>
    <!-- 使用 less 变量进行主题切换 相关修改 结束 -->
</body>

</html>
```

使用 modifyVars 方法修改 less 变量的代码实现如下：

```tsx
// src/views/lessVariable.tsx
import * as React from 'react';
import { Radio, Layout, message } from 'antd';
import '../styles/lessVariable.less';

export default class LessVariable extends React.Component<any, any> {

    state: any = {
        theme: 'default',
        // 暗黑主题相关 less 变量特定值
        darkTheme: {
            '@radio-dot-color': '#11121C',
            '@layout-body-background': '#0e0e17',
            '@text-color': '#fff',
            '@heading-color': '#fff'
        }
    }

    componentDidMount() {}

    onChange = (e: any) => {
        const { darkTheme } = this.state;
        let newTheme = e.target.value;
        // 调用 modifyVars 进行修改 less 变量
        (window as any).less
        .modifyVars(newTheme === 'dark' ? darkTheme : {})
        .then(() => {})
        .catch((err: any) => {
            console.error(err.message);
            message.error('Failed to update theme');
        });
        this.setState({
            theme: newTheme
        })
    }

    render() {
        const { theme } = this.state;
        return (
            <Layout className="less-variable">
                <h3>使用 less 变量进行主题切换</h3>
                <div>
                    <span>当前主题：</span>
                    <Radio.Group value={theme} onChange={this.onChange}>
                        <Radio value={'default'}>默认主题</Radio>
                        <Radio value={'dark'}>暗黑主题</Radio>
                    </Radio.Group>
                </div>
            </Layout>
        )
    }
}
```

使用 modifyVars 方法更改预设的 less 变量可使得多处的样式(使用了 less 变量)同时变化，减少了很多 css 代码的编写。但是 antd 提供的 less 变量（[所有样式变量](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)）有限，并不能满足全部样式更改的需求，还是需要通过样式名去修改样式。

## 动态加载不同的主题文件

该方案的主要思想是编写不同主题的问题，切换主题时切换加载的主题样式文件。通过该方案实现主题切换，需要以下三个步骤。

### 步骤一：准备不同的主题文件

笔者准备了三个样式文件，分别是 common.less、 default.less、 dark.less

- common.less：包含不同主题共有的样式
- default.less：包含默认主题的样式
- dark.less：包含暗黑主题的样式

每个文件中的代码实现如下：

```less
// src/styles/theme/common.less
@import '~antd/dist/antd.less';

.multiple-files {
    padding: 20px 20px;
    height: 100%;
}
```

```less
// src/styles/theme/default.less
@import './common.less';

// 可继续添加该主题特有样式
```

```less
// src/styles/theme/dark.less
@import './common.less';

// 通过 less 变量覆盖样式
@layout-body-background: #0e0e17;
@text-color: #fff;
@heading-color: #fff;

// 通过样式名修改样式
.ant-radio-wrapper {
    color: #fff;
}
.ant-radio-inner {
    background-color: #11121C;
    border-color: #363B59;
}
```

### 步骤二：修改 webpack 配置

在此方案实现中，不同主题的样式文件都需要导入，并且编译的时候，需要将不同主题的样式文件单独编译，便于我们后续进行动态切换加载的文件。其次，css 样式文件需要提取为外部代码，不能混合在 js 中一起被编译。相关 webpack 配置如下：

```javascript
// build/base.js

// 不同主题文件单独编译
optimization: {
    splitChunks: {
        chunks: "all",
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 8,
        automaticNameDelimiter: "~",
        name: true,
        cacheGroups: {
            baseCommon: {
                test: splitChunksConfig.baseCommonRegExp,
                priority: 1
            },
            // 动态加载不同的主题文件 相关配置 开始
            default: {
                test: /[\\/]styles[\\/]theme[\\/]default.less/,
                priority: 1
            },
            dark: {
                test: /[\\/]styles[\\/]theme[\\/]dark.less/,
                priority: 1
            }
            // 动态加载不同的主题文件 相关配置 结束
        }
    },
    runtimeChunk: {
        name: "manifest"
    }
}

// 提取为外部css代码
plugins: [
    new MiniCssExtractPlugin({
        filename: '[name].css?v=[contenthash:8]'
    })
]
```

### 步骤三：导入主题文件并实现动态加载

导入不同的主题文件后，通过 webpack 打包，会在 head 标签中添加 link 标签引入所有的样式文件。此时，可以通过控制 link 标签的 disabled 属性进行样式加载的切换。代码实现如下：

```tsx
//src/views/multipleFiles.tsx
import * as React from 'react';
import { Radio, Layout } from 'antd';
// 导入所有的主题文件
import '../styles/theme/default.less';
import '../styles/theme/dark.less';

export default class MultipleFiles extends React.Component<any, any> {

    state: any = {
        theme: 'default'
    }

    componentDidMount() {
        this.setLink('default');
    }

    onChange = (e: any) => {
        this.setLink(e.target.value);
        this.setState({
            theme: e.target.value
        })
    }

    setLink = (currTheme: any) => {
        const disableTheme = currTheme === 'dark' ? 'default' : 'dark';
        // 通过控制 link 标签的 disabled 属性进行样式加载的切换
        // link 加载 css 需要 webpack 配置的配合
        const arr = document.getElementsByTagName('link');
        for (let i = 0, len = arr.length; i < len; i++) {
            let href = arr[i].getAttribute('href');
            if (href && href.indexOf(disableTheme) !== -1) {
                arr[i].disabled = true;
            }
            if (href && href.indexOf(currTheme) !== -1) {
                arr[i].disabled = false;
            }
        }
    }

    render() {
        const { theme } = this.state;
        return (
            <Layout className="multiple-files">
                <h3>动态加载不同的主题文件进行主题切换</h3>
                <div>
                    <span>当前主题：</span>
                    <Radio.Group value={theme} onChange={this.onChange}>
                        <Radio value={'default'}>默认主题</Radio>
                        <Radio value={'dark'}>暗黑主题</Radio>
                    </Radio.Group>
                </div>
            </Layout>
        )
    }
}
```

在 dark.less 文件中，可以看到，使用这种方式进行主题切换，对于可使用 less 变量的样式，直接使用 less 变量即可进行修改；其余样式，使用 antd 类名编写样式也可以进行覆盖。相较于前两种方案，在开发量庞大的项目中，使用这种方案进行主题切换是更好的选择。

## 附录

参考文章：

[一文总结前端换肤换主题](https://www.jianshu.com/p/35e0581629d2)

[antd 在线换肤定制功能](https://www.jianshu.com/p/b635211658c8)
