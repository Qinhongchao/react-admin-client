import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button/index";
import { reqUsers ,reqAddOrUpdateUser,reqDeleteUser} from "../../api";
import UserForm from "./user-form";

export default class User extends Component {
  state = {
    users: [],
    isShow: false,
  };

  componentWillMount() {
    this.initColumns();
   
  }

  componentDidMount() {
    this.getUsers();
  }

  /*
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
   */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存
    this.roleNames = roleNames
  }

  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const {users,roles} = result.data;
      this.initRoleNames(roles)
      this.setState({ users ,roles});
    } else {
      message.error("获取用户数据失败");
    }
  };
  showUpdate=(user)=>{
    this.user=user
    this.setState({isShow:true})
  }

  addOrUpdateUser = () => {
    
    this.setState({ isShow: false });
    this.form.validateFields(async(error,values)=>{
      const {username,password,phone,email,role_id}=values
      const user={username,password,phone,email,role_id}
      if(this.user&&this.user._id){
          user._id=this.user._id
      }
      const result=await reqAddOrUpdateUser(user)
      if(result.status===0){
        message.success('添加用户成功')
        this.getUsers()
      }else{
        message.error('添加用户失败')
      }
    })
  };

  showAdd = () => {
    this.user={}
    this.setState({ isShow: true });
  };

  deleteUser=async(user)=>{
  const result= await reqDeleteUser(user._id)
  if(result.status===0){
    message.success('删除用户成功')
    this.getUsers()
  }else{
    message.error('删除用户失败')
  }
  }

  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },

      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: (role_id) => this.roleNames[role_id],
      },
      {
        title: "操作",
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        ),
      },
    ];
  };

  render() {
    const { users,roles, isShow } = this.state;
    const user = this.user || {}

    const title = (
      <Button type="primary" onClick={this.showAdd}>
        创建用户
      </Button>
    );

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: 5 }}
        ></Table>

        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.setState({ isShow: false });
          }}
        >
          <UserForm
            setForm={(form) => (this.form = form)}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    );
  }
}
