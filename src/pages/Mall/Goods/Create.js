import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';

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
  Upload,
  message,
  Modal,
  Steps
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { Step } = Steps;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class CreatePage extends PureComponent {

  state = {
    msg: '',
    url: '',
    data: {
      goods_types: [],
    },
    status: '',
    loading: false,
    selected:'0'
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {

    // 获得url参数
    const params = this.props.location.query;

    // loading
    this.setState({ loading: true });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/create',
      },
      callback: (res) => {
        if (res) {
          if(params.id) {
            this.setState({ data: res.data,selected:params.id });
          } else {
            this.setState({ data: res.data,selected:'0' });
          }
        }
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: {
            actionUrl: 'admin/goods/store',
            ...values,
          },
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

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

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: 12,
        offset: 2
      },
    };

    let state = {
      loading: false,
    };

    return (
      <PageHeaderWrapper title={false}>
        <div style={{background:'#fff',padding:'10px'}}>
          <Steps current={0}>
            <Step title="Step1" description="选择商品分类" />
            <Step title="Step2" description="填写商品详情" />
            <Step title="Step3" description="上传商品图片" />
            <Step title="Step4" description="商品发布成功" />
          </Steps>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CreatePage;