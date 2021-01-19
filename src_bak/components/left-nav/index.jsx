import React, { Component } from "react";
import { Menu, Icon } from "antd";
import logo from "../../assets/images/SGM-PATAC-Logo.png";
import { Link } from "react-router-dom";
import menuList from "../../config/menuConfig";
import { withRouter } from "react-router-dom";
import  memoryUtils from '../../utils/memoryUtils'
import "./index.less";

const { SubMenu } = Menu;

class LeftNav extends Component {

  

  hasAuth=(item)=>{

    const {key , isPublic}=item
    const menus=memoryUtils.user.role.menus
    const username=memoryUtils.user.username

    if(isPublic||username==='admin'||menus.indexOf(key)!==-1){
      return true
    }else if(item.children&&item.children.length>0){
      return !!item.children.find(child=>{return menus.indexOf(child.key)!==-1})
    }

    return false

  }

  getMenuNodes(menuList) {
    const pathName = this.props.location.pathname;
    return menuList.reduce((prev, item) => {

      if(this.hasAuth(item)){
      if (!item.children) {
        prev.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )

        );
      } else {
        const openKey=item.children.map(child=>child.key).find(key=>key===pathName)
        if(openKey){
          this.openKey=item.key
        }
       
        prev.push((
          <SubMenu key={item.key} title={
            <span>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </span>
          }>
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )

        );
      }}
      return prev;
    }, []);
  }



  render() {
    const pathName = this.props.location.pathname;
    const menuNodes = this.getMenuNodes(menuList);
   
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
         
        </Link>
        <div className='bottom-line'></div>
        <Menu
          selectedKeys={[pathName]}
          defaultOpenKeys={[this.openKey]}
          mode="inline"
          theme="dark"
        >
          {menuNodes}
        </Menu>
      </div>
    );
  }
}

export default withRouter(LeftNav);
