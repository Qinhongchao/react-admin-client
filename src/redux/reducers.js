import { INCREMENT, DECREMENT } from './action-types'
import {combineReducers} from '../lib/redux'

const initState=0

export function count(state=initState, action) {
    switch (action.type) {
        case INCREMENT:
            return state + action.data * 1
        case DECREMENT:
            return state - action.data * 1
        default:
            return state


    }
}

export default combineReducers({count})

