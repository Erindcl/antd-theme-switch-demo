import * as React from 'react';
import { Radio, Layout } from 'antd';
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
        const arr = document.getElementsByTagName('link');
        console.log(arr)
        for (let i = 0, len = arr.length; i < len; i++) {
            let href = arr[i].getAttribute('href');
            console.log(href)
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
                <h3>编写多套主题文件进行主题切换</h3>
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