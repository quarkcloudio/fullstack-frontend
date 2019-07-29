import React, { Component } from 'react';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import styles from './Login.less';

import { Form, Input, Button, Icon, Row, Col} from 'antd';

interface IFormComponentProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

@connect(({ loading }: { loading: { effects: { [key: string]: string } } }) => ({
  submitting: loading.effects['login/login'],
}))

class LoginPage extends Component<IFormComponentProps> {

  state = {
    captcha: '/api/admin/captcha',
  };

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'login/login',
          payload: values,
          callback: (res: any) => {
            // 执行成功后，进行回调
            if (res) {
              // 接口得到数据，放到state里
              if(res.status == 'error') {
                this.handleGetCaptcha();
              }
            }
          },
        });
      }
    });
  };

  componentDidMount() {
    this.handleGetCaptcha();
  }
  
  handleGetCaptcha = () => {
    this.setState({
      captcha:'/api/admin/captcha?random='+Math.random()
    });
  };

  render() {
    const { submitting } = this.props;

    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('username')(
              <Input
                size="large"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password')(
              <Input
                size="large"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Row gutter={10}>
              <Col span={16}>
                {getFieldDecorator('captcha')(
                  <Input
                    size="large"
                    prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="验证码"
                  />
                )}
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
              loading={submitting}
              htmlType="submit"
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

export default Form.create<IFormComponentProps>()(LoginPage);
