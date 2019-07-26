import React, { Component } from 'react';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import router from 'umi/router';
import { Button,Form, Result } from 'antd';

interface IFormComponentProps extends FormComponentProps {
  dispatch: Dispatch<any>;
}

@connect(({ loading }: { loading: { effects: { [key: string]: string } } }) => ({
  submitting: loading.effects['account/changeAccountProfile'],
}))

class NoPermissionPage extends Component<IFormComponentProps> {
  render() {
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问当前页面！"
        extra={
          <Button type="primary" onClick={() => router.push('/')}>
            返回主页
          </Button>
        }
      ></Result>
    );
  }
}

export default Form.create<IFormComponentProps>()(NoPermissionPage);
