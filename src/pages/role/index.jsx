import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import { reqAddRole, reqRoles, reqUpdateRole } from "../../api";
import { formateDate } from "../../utils/dateUtils";
import { PAGE_SIZE } from "../../utils/constants";
import memoryUtils from '../../utils/memoryUtils'

export default class Role extends Component {
  state = {
    isShowAdd: false,
    isShowAuth: false,
    roles: [],
    role: {},
  };
  constructor(props) {
    super(props);
    this.auth = React.createRef();
  }
  componentWillMount() {
    this.initColumn();
  }
  componentDidMount() {
    this.getRoles();
  }
  addRole = () => {
    this.form.validateFields(async (error, values) => {
      if (!error) {
        this.setState({ isShowAdd: false });
        const { roleName } = values;
        this.form.resetFields();
        const result = await reqAddRole(roleName);
        if (result.status === 0) {
          message.success("添加角色成功!");
          this.getRoles();
        } else {
          message.error("添加角色失败");
        }
      }
    });
  };
  updateRole = async () => {
    const menus = this.auth.current.getMenus();
    const role = this.state.role;
    role.menus = menus;
    role.auth_time=Date.now()
    role.auth_name=memoryUtils.user.username
    this.setState({ role });
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      message.success("更新角色权限成功");
    } else {
      message.error("更新角色权限失败");
    }
    this.setState({isShowAuth:false})

  };
  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };

  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const { data } = result;

      this.setState({ roles: data });
    } else {
      message.error("获取角色数据失败");
    }
  };
  onRow = (role) => {
    return {
      onClick: (event) => {
        // 点击行

        this.setState({
          role,
        });
      },
    };
  };
  render() {
    const { isShowAdd, isShowAuth, roles, role } = this.state;

    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>
        &nbsp;&nbsp;
        <Button
          type="primary"
          disabled={!this.state.role._id}
          onClick={() => this.setState({ isShowAuth: true })}
        >
          设置角色权限
        </Button>
      </span>
    );

    return (
      <Card title={title}>
        <Table
          rowKey="_id"
          bordered
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              // 选择某个radio时回调
              this.setState({
                role,
              });
            },
          }}
          onRow={this.onRow}
        ></Table>
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => this.setState({ isShowAdd: false })}
        >
          <AddForm setForm={(form) => (this.form = form)} />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => this.setState({ isShowAuth: false })}
        >
          <AuthForm ref={this.auth} role={this.state.role} />
        </Modal>
      </Card>
    );
  }
}
