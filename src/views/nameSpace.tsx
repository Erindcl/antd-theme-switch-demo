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
                <h3>优点：</h3>
                <p>简单，便于实现，通俗易懂</p>
                <h3>缺点：</h3>
                <p>需要手动编写全部的 css。特别的，antd 组件很多，需要挨个去查找组件类名在进行样式编写，开发量较大</p>
            </div>
        )
    }
}