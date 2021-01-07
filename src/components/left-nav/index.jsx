import React, { Component } from "react";
import { Menu, Icon } from "antd";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import menuList from "../../config/menuConfig";
import { withRouter } from "react-router-dom";
import "./index.less";

const { SubMenu } = Menu;

class LeftNav extends Component {
  getMenuNodes(menuList) {
    const pathName = this.props.location.pathname;
    return menuList.reduce((prev, item) => {
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
      }
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
          <h1>商品后台</h1>
        </Link>
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
