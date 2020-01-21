import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import styles from './Login.less';

import { Form, Input, Button, Row, Col} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

const Iconfont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1615691_y9lfy84fltb.js', // 在 iconfont.cn 上生成
});

interface IProps {
  dispatch:Dispatch<any>;
  submitting: boolean;
}

class LoginPage extends Component<IProps> {

  formRef: React.RefObject<any> = React.createRef();

  state = {
    captcha: '/api/admin/captcha'
  };
  
  componentDidMount() {
    this.handleGetCaptcha();
  }
  
  handleGetCaptcha = () => {
    this.setState({
      captcha:'/api/admin/captcha?random='+Math.random()
    });
  };

  onFinish = (values:any) => {
    this.props.dispatch({
      type: 'login/login',
      payload: {
        actionUrl: 'admin/login',
        ...values
      },
      callback: (res: any) => {
        // 接口得到数据，放到state里
        if(res.status == 'error') {
          this.handleGetCaptcha();
        }
      },
    });
  };

  render() {

    const {submitting} = this.props;

    return (
      <div className={styles.main}>
        <Form ref={this.formRef} onFinish={this.onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '用户名必须填写！' }]}
          >
            <Input
              size="large"
              prefix={<Iconfont type="icon-custom-user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '密码必须填写！' }]}
          >
              <Input
                size="large"
                prefix={<Iconfont type="icon-password" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                type="password"
                placeholder="密码"
              />
          </Form.Item>
          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '验证码必须填写！' }]}
          >
            <Row gutter={10}>
              <Col span={16}>
                <Input
                  size="large"
                  prefix={<Iconfont type="icon-yanzhengma" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                  placeholder="验证码"
                />
              </Col>
              <Col span={8}>
                {<img 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.handleGetCaptcha();
                  }}
                  src={this.state.captcha}
                  alt="验证码"
                 />}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={submitting}
              className={styles.loginFormButton}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state:any) {
  const { submitting } = state.login;
  return {
    submitting
  };
}

export default connect(mapStateToProps)(LoginPage);