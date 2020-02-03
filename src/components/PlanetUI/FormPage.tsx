import React, { useEffect } from 'react';
import styles from './FormPage.less';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import router from 'umi/router';

import {
  Card,
  Spin,
  InputNumber,
  DatePicker,
  Tabs,
  Switch,
  Form,
  Select,
  Input,
  Button,
  Checkbox,
  Radio,
  Upload,
  message,
  Modal,
  Tree,
  Cascader
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { TreeNode } = Tree;

export interface FormPageProps {
  title:string;
  loading: boolean;
  controls?: [];
  api?: string;
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const FormPage: React.SFC<FormPageProps> = props => {

  const {
    title,
    loading,
    api,
    dispatch
  } = props;

  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'form/info',
        payload: {
          actionUrl: api,
        }
      });
    }
  }, [dispatch, api]);

  const onFinish = (values:any) => {
    dispatch({
      type: 'form/submit',
      payload: {
        actionUrl: 'admin/login',
        ...values
      },
      callback: (res: any) => {

      },
    });
  };

  return (
  <Spin spinning={loading} tip="Loading..." style={{background:'#fff'}}>
      <Card
        size="small"
        title={title}
        bordered={false}
        extra={<Button type="link" onClick={(e) => router.go(-1)}>返回上一页</Button>}
      >
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '用户名必须填写！' }]}
          >
            <Input
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
  </Spin>
  );
};

function mapStateToProps(state:any) {
  const {
    title,
    loading,
    controls,
  } = state.form;

  return {
    title,
    loading,
    controls,
  };
}

export default connect(mapStateToProps)(FormPage);