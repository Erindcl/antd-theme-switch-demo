import * as React from 'react'
import { Route, IndexRoute } from 'react-router'

import NotFund from './components/notFund';
// import NameSpace from './views/nameSpace';
// import LessVariable from './views/lessVariable';
import MultipleFiles from './views/multipleFiles';
import Watermark from './views/watermark';

export default (
    <Route path="/" component={null}>
        <IndexRoute component={MultipleFiles} />
        {/* <Route path="/nameSpace" component={NameSpace}></Route> */}
        {/* <Route path="/lessVariable" component={LessVariable}></Route> */}
        <Route path="/multipleFiles" component={MultipleFiles}></Route>
        <Route path="/watermark" component={Watermark}></Route>
        <Route path="/*" component={NotFund} />
    </Route>
)
