import React, { Component } from 'react'
import store from '../redux/store'
import {increment,decrement} from '../redux/actions'
import {connect} from '../lib/react-redux'

 class counter extends Component {
  constructor(props){
    super(props)
    this.numberRef=React.createRef()
  }
  handleIncrement = () => {
    const number = this.numberRef.current.value * 1
    this.props.increment(number)
    
  }

  handleDecrement = () => {
    const number = this.numberRef.current.value * 1
    this.props.decrement(number)
   
  }
  render() {
    const count=this.props.count
   
    return (
        <div>
        <p>click {count} times</p>

        <div>
          <select ref={this.numberRef} >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select> &nbsp;&nbsp;
          <button onClick={this.handleIncrement}>+</button>&nbsp;&nbsp;
          <button onClick={this.handleDecrement}>-</button>&nbsp;&nbsp;
          <button >increment if odd</button>&nbsp;&nbsp;
          <button >increment async</button>
        </div>
      </div>
    )
  }
}

export default connect(state=>({count:state.count}),{increment,decrement})(counter)
