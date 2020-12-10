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
                <br />
                <h3>特点：</h3>
                <p>对于可使用 less 变量的样式，直接使用 less 变量进行修改；其余样式，使用 antd 类名编写样式进行覆盖</p>
            </Layout>
        )
    }
}