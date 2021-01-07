import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import {Redirect,Switch,Route} from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav'
import Home from '../home'
import Category from '../category'
import Product from '../product'
import User from '../user'
import Role from '../role'
import Pie from '../chart/pie'
import Line from '../chart/line'
import Bar from '../chart/bar'


const { Header, Footer, Sider, Content } = Layout;

export default class Admin extends Component {



  render() {

    const user=memoryUtils.user

    if(!user||!user._id){

      return <Redirect to='/login' />
    }

    return (
      <Layout style={{height:'100%'}}>
      <Sider><LeftNav/></Sider>
      <Layout>
        <Header>Header</Header>
        <Content style={{backgroundColor:'white'}}>
          <Switch>
            <Route path='/home'  component={Home}/>
            <Route path='/role'  component={Role}/>
            <Route path='/user'  component={User}/>
            <Route path='/category'  component={Category}/>
            <Route path='/product'  component={Product}/>
            <Route path='/chart/pie'  component={Pie}/>
            <Route path='/chart/line'  component={Line}/>
            <Route path='/chart/bar'  component={Bar}/>
            <Redirect to='/home' />
          </Switch>
        </Content>
        <Footer style={{textAlign:'center',color:'gray'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
      </Layout>
    </Layout>
    )
  }
}
