import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Dropdown, Avatar, Menu, Spin } from 'antd';
import ProLayout, {
  PageHeaderWrapper
} from '@ant-design/pro-layout';
import router from 'umi/router';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  FileWordOutlined,
  FilePptOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  SnippetsOutlined,
  SettingOutlined,
  PaperClipOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import styles from './AdminLayout.less';

interface IProps {
  dispatch:Dispatch<any>;
  menus: [];
}

class AdminLayout extends Component<IProps> {

  componentDidMount() {
    this.props.dispatch({
      type: 'global/getMenus',
      payload: {
        actionUrl: 'admin/account/menus'
      }
    });
  }

  state = {
    collapsed: false,
    userInfo:{
      nickname:'tangtanglove',
      avatar:undefined
    },
  };

  onMenuClick = (e:any) => {
    router.push(e.key);
  };

  render() {

    const { menus,children } = this.props;

    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            <SettingOutlined /> 个人设置
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
            <LogoutOutlined /> 退出登录
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div
        style={{
          transform: 'rotate(0)',
          overflowX: 'hidden',
        }}
      >
        <ProLayout
          style={{
            height:'100vh',
          }}
          location={{
            pathname: '/console/index?id=1',
          }}
          menuDataRender={() => menus}
          fixedHeader={true}
          fixSiderbar={true}
          rightContentRender={() =>
            <div className={styles.right}>
              {this.state.userInfo.nickname ? 
                <Dropdown className={styles.container} overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={this.state.userInfo.avatar} alt="avatar" />
                      <span className={styles.name}>{this.state.userInfo.nickname}</span>
                  </span>
                </Dropdown>
              : 
                <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
              }
            </div>
          }
          menuProps={{ onClick:this.onMenuClick}}
        >
          <PageHeaderWrapper content="欢迎使用">
            {children}
          </PageHeaderWrapper>
        </ProLayout>
      </div>
    );
  }
}

function mapStateToProps(state:any) {
  const { menus } = state.global;
  return {
    menus
  };
}

export default connect(mapStateToProps)(AdminLayout);