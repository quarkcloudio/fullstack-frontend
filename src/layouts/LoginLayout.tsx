import React, { Component } from 'react';
import { Dispatch } from 'redux';
import logo from '../assets/logo.svg';
import styles from './LoginLayout.less';

interface IProps {
  dispatch:Dispatch<any>;
}

class LoginLayout extends Component<IProps> {

  componentDidMount() {
    document.title = '管理员登录';
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>FullStack</span>
            </div>
            <div className={styles.desc}><p>在信息丰富的世界里，唯一稀缺的资源就是人类的注意力。</p></div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default LoginLayout;