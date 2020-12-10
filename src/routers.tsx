import * as React from 'react'
import { Route, IndexRoute } from 'react-router'

import NotFund from './components/notFund';
import NameSpace from './views/nameSpace';
import LessVariable from './views/lessVariable';

export default (
    <Route path="/" component={null}>
        <IndexRoute component={NameSpace} />
        <Route path="/nameSpace" component={NameSpace}></Route>
        <Route path="/lessVariable" component={LessVariable}></Route>
        <Route path="/*" component={NotFund} />
    </Route>
)
