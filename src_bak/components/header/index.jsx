import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from '../link-button'
import { reqWeather } from "../../api";
import { Modal} from 'antd'
import "./index.less";

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: "", // 天气图片url
    weather: "", // 天气的文本
  };

  componentDidMount() {
    this.getTime();
    this.getWeather()
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      this.setState({ currentTime: formateDate(Date.now()) });
    }, 1000);
  };

  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather("上海");
    this.setState({
      dayPictureUrl,
      weather,
    });
  };

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      if (item.key === path) {
        // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title;
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(
          (cItem) => path.indexOf(cItem.key) === 0
        );
        // 如果有值才说明有匹配的
        if (cItem) {
          // 取出它的title
          title = cItem.title;
        }
      }
    });
    return title;
  };

  logout=()=>{
      // 显示确认框
      Modal.confirm({
        content: '确定退出吗?',
        onOk: () => {
        
          // 删除保存的user数据
          storageUtils.deleteUser()
          memoryUtils.user = {}
  
          // 跳转到login
          this.props.history.replace('/login')
        }
      })
  }

  render() {
    const title = this.getTitle();
    const username = memoryUtils.user.username;
    const {time, dayPictureUrl, weather} = this.state;

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎 : {username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{time}</span>
            <img src={dayPictureUrl} alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
