import React from 'react';
import styles from './BasicForm.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';

import {
  Card,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Tabs,
  Switch,
  Icon,
  Tag,
  Form,
  Select,
  Input,
  Button,
  Checkbox,
  Radio,
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export interface BasicFormProps extends FormComponentProps {
  title?: string;
  action?: string;
  fields?: [];
  data?: [];
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const BasicForm: React.SFC<BasicFormProps> = props => {

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 22 },
    },
  };

  const {
    title,
    action,
    fields,
    data
  } = props;

  const { submitting } = props;
  const {
    form: { getFieldDecorator },
  } = props;

  const handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {

      if (!err) {
        dispatch({
          type: 'builder/submit',
          payload: {
            action: action,
            ...values,
          },
        });
      }
    });
  };

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <div className={styles.container}>
          <Card
              size="small"
              title={title}
              bordered={false}
              extra={<a href="javascript:history.go(-1)">返回上一页</a>}
            >
            <Form onSubmit={handleSubmit}>
              <Form.Item style={{ marginBottom: 8 }} {...formItemLayout} label="标题">
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '请输入标题！' }],
                })(<Input className={styles.middleItem} placeholder="请输入标题" />)}
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </PageHeaderWrapper>
    </div>
  );
};

export default Form.create<BasicFormProps>()(
  connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
    submitting: loading.effects['builder/submit'],
  }))(BasicForm),
);
