import * as React from 'react';
import { Radio, Layout, message } from 'antd';
import '../styles/lessVariable.less';

export default class LessVariable extends React.Component<any, any> {

    state: any = {
        theme: 'default',
        darkTheme: {
            '@radio-dot-color': '#11121C',
            '@layout-body-background': '#0e0e17',
            '@text-color': '#fff',
            '@heading-color': '#fff'
        }
    }

    componentDidMount() {
        
    }

    onChange = (e: any) => {
        const { darkTheme } = this.state;
        let newTheme = e.target.value;
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
                <h3>添加 less 变量进行主题切换</h3>
                <div>
                    <span>当前主题：</span>
                    <Radio.Group value={theme} onChange={this.onChange}>
                        <Radio value={'default'}>默认主题</Radio>
                        <Radio value={'dark'}>暗黑主题</Radio>
                    </Radio.Group>
                </div>
                <br />
                <h3>优点：</h3>
                <p>更改预设的 less 变量即可使得多处的样式同时变化，减少了很多 css 代码的编写</p>
                <h3>缺点：</h3>
                <p>antd 提供的 less 变量有限，并不能满足某些样式更改的需求</p>
            </Layout>
        )
    }
}