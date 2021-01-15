import React, { Component } from "react";
import {Switch,Route,Redirect} from 'react-router-dom'
import Home from './home'
import AddUpdate from './add-update'
import Detail from './detail'


import "./index.less";

export default class Product extends Component {


  render() {
   return (
      <Switch>
        <Route path='/product' component={Home} exact></Route>
        <Route path='/product/addupdate' component={AddUpdate}></Route>
        <Route path='/product/detail' component={Detail}></Route>
        <Redirect to='/product' />
      </Switch>
   )
  }
}
