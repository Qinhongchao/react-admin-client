import React from 'react'
import ReactDOM from 'react-dom'
import App from './container/app'
import store from './redux/store'
import {Provider} from './lib/react-redux'

// ReactDOM.render(<App/>,document.getElementById('root'))
// store.subscribe(()=>{
//     ReactDOM.render(<App/>,document.getElementById('root'))
// })

ReactDOM.render(<Provider store={store}><App/></Provider>,document.getElementById('root'))
