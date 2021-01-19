import React, { Component } from "react";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";

const Item = Form.Item;

const { TreeNode } = Tree;

export default class AuthForm extends Component {
  state = {
    role: {},
    checkedKeys: [],
  };

  constructor(props){
    super(props)
   
    const menus=this.props.role.menus
      
    this.state={
        checkedKeys:menus
    }
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList);
  }
  componentDidMount(){
    
  }

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  };

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      );
      return pre;
    }, []);
  };

  componentWillReceiveProps(nextProps){

    const {menus}=nextProps.role
    this.setState({
        checkedKeys:menus
    })

  }

  getMenus=()=>{
      return this.state.checkedKeys
  }

  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;

    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    };
    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>

        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    );
  }
}
