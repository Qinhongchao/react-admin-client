import React, { Component } from "react";
import { Menu, Icon } from "antd";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { PieChartOutlined, MailOutlined } from "@ant-design/icons";
import "./index.less";

const { SubMenu } = Menu;

export default class index extends Component {
  render() {
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>商品后台</h1>
        </Link>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/home">
              <Icon type="pie-chart" />
              <span> 首页</span>
            </Link>
          </Menu.Item>

          <SubMenu key="2" icon={<MailOutlined />} title="商品">
            <Menu.Item key="5">
              <Link to="/category">
                <Icon type="mail" />
                <span> 品类管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/product">
                <Icon type="mail" />
                <span> 商品管理</span>
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="7" icon={<MailOutlined />} title="图表">
            <Menu.Item key="5">
              <Link to="/category">
                <Icon type="mail" />
                <span> 饼图</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/product">
                <Icon type="mail" />
                <span> 柱状图</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="9">
              <Link to="/product">
                <Icon type="mail" />
                <span> 折线图</span>
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="3" icon={<PieChartOutlined />}>
            <Link to="/user">
              <Icon type="mail" />
              <span> 用户管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<PieChartOutlined />}>
            <Link to="/role">
              <Icon type="mail" />
              <span> 角色管理</span>
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
