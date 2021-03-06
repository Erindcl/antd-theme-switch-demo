import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux'

import { user } from './modules/user'

// 全局State
const rootReducer = combineReducers({
    routing,
    user
})

export default rootReducer
