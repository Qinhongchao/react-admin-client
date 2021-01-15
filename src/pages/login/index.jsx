import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import logo from "../../assets/images/logo.png";
import "./index.less";
import {reqLogin} from '../../api'
import {message} from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {Redirect} from 'react-router-dom'


class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
      const {username,password} =values
       const result= await reqLogin(username,password)
       if(result.status===0){
       
          message.success('登录成功')
          memoryUtils.user=result.data
          storageUtils.saveUser(result.data)
          this.props.history.replace('/')

       }else{
          message.error('登录失败：'+result.msg)
       }
      }
    });
  };

  validatePwd = (rule, value, callback) => {
    console.log("validatePwd()", rule, value);
    if (!value) {
      callback("密码必须输入");
    } else if (value.length < 4) {
      callback("密码长度不能小于4位");
    } else if (value.length > 12) {
      callback("密码长度不能大于12位");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback("密码必须是英文、数字或下划线组成");
    } else {
      callback(); // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const user =memoryUtils.user;
    if(user&&user._id){
      return <Redirect to='/' />
    }
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h2>React项目：后台管理系统</h2>
        </header>

        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "用户名必须输入",
                  },
                  { min: 4, message: "用户名至少4位" },
                  { max: 12, message: "用户名最多12位" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "用户名必须是英文、数字或下划线组成",
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Username"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [{ validator: this.validatePwd }],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
export default Form.create({ name: "normal_login" })(Login);
