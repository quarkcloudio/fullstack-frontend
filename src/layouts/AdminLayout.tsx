import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Dropdown, Avatar, Layout, Menu, Spin } from 'antd';
import router from 'umi/router';
import DocumentTitle from 'react-document-title';
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

const { SubMenu } = Menu;
const { Header, Sider, Content, Footer } = Layout;

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
    }
  };

  onMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onMenuClick = (e:any) => {
    const { menus } = this.props;

    let path = '';

    menus.map((menu:any) => {
      if(menu.children) {
        menu.children.map((child:any) => {
          if(child.children) {
            child.children.map((grandson:any) => {
              if(e.key == grandson.id) {
                path = grandson.path;
              }
            })
          } else {
            if(e.key == child.id) {
              path = child.path;
            }
          }
        })
      } else {
        if(e.key == menu.id) {
          path = menu.path;
        }
      }
    })

    router.push(path);
  };

  menuIcon = (icon:string) =>{
    if(icon == 'home' || icon == 'HomeOutlined') {
      return(
        <HomeOutlined />
      )
    }

    if(icon == 'file-word' || icon == 'FileWordOutlined') {
      return(
        <FileWordOutlined />
      )
    }

    if(icon == 'file-ppt' || icon == 'FilePptOutlined') {
      return(
        <FilePptOutlined />
      )
    }

    if(icon == 'user-add' || icon == 'UserAddOutlined') {
      return(
        <UserAddOutlined />
      )
    }

    if(icon == 'usergroup-add' || icon == 'UsergroupAddOutlined') {
      return(
        <UsergroupAddOutlined />
      )
    }

    if(icon == 'snippets' || icon == 'SnippetsOutlined') {
      return(
        <SnippetsOutlined />
      )
    }

    if(icon == 'setting' || icon == 'SettingOutlined') {
      return(
        <SettingOutlined />
      )
    }

    if(icon == 'paper-clip' || icon == 'PaperClipOutlined') {
      return(
        <PaperClipOutlined />
      )
    }

    if(icon == 'user' || icon == 'UserOutlined') {
      return(
        <UserOutlined />
      )
    }

    if(icon == 'shop' || icon == 'ShopOutlined') {
      return(
        <ShopOutlined />
      )
    }
  }

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
      <DocumentTitle
        title={'后台管理'}
      >
        <Layout>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}
            style={{
              height: '100vh',
            }}
          >
            <div className={styles.logo}>Logo</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              {!!menus &&
                menus.map((menu:any) => {
                  if(menu.children) {
                    return (
                      <SubMenu key={menu.id}
                        title={
                          <span>
                            {this.menuIcon(menu.icon)}
                            <span>{menu.name}</span>
                          </span>
                        }
                      >
                        {!!menu.children && menu.children.map((grandson:any) => {
                          if(grandson.children) {
                            return (
                              <SubMenu key={grandson.id}
                                title={
                                  <span>
                                    {this.menuIcon(grandson.icon)}
                                    <span>{grandson.name}</span>
                                  </span>
                                }
                              >
                                {!!grandson.children && grandson.children.map((grandsonItem:any) => {
                                  return(
                                    <Menu.Item key={grandsonItem.id} onClick={this.onMenuClick} >
                                      {this.menuIcon(grandsonItem.icon)}
                                      <span>{grandsonItem.name}</span>
                                    </Menu.Item>
                                  )
                                })}
                              </SubMenu>
                            )
                          } else {
                            return (
                              <Menu.Item key={grandson.id} onClick={this.onMenuClick} >
                                {this.menuIcon(grandson.icon)}
                                <span>{grandson.name}</span>
                              </Menu.Item>
                            )
                          }
                        })}
                      </SubMenu>
                    );
                  } else {
                    return (
                      <Menu.Item key={menu.id}>
                        {this.menuIcon(menu.icon)}
                        <span>{menu.name}</span>
                      </Menu.Item>
                    );
                  }
                })
              }
            </Menu>
          </Sider>
          <Layout className={styles.siteLayout}>
            <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: styles.trigger,
                onClick: this.onMenuCollapse,
              })}
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
            </Header>
            <Content
              className={styles.siteLayoutBackground}
              style={{
                margin: '24px 16px',
                padding: 24,
                overflow: 'initial'
              }}
            >
              {children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>FullStack ©2020</Footer>
          </Layout>
        </Layout>
      </DocumentTitle>
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