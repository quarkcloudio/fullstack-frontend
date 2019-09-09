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
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
var id = 0;

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
        actionUrl: 'admin/goods/spuCreate',
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

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: {
            actionUrl: 'admin/goods/spuStore',
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

    getFieldDecorator('keys', { initialValue: [0,1,2] });

    const keys = getFieldValue('keys');

    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '属性值' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`attribute_values[${k}]`,{
            initialValue: '',
          })(
          <Input placeholder="请输入属性可选值" style={{ width: '300px', marginRight: 8 }} />
        )}

        {getFieldDecorator(`attribute_values_sort[${k}]`,{
            initialValue: 0,
          })(
          <Input placeholder="排序" style={{ width: '60px', marginRight: 8 }} />
        )}

        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <PageHeaderWrapper title={false}>
        <div>
          <Card
            size="small"
            title="添加属性"
            bordered={false}
            extra={<a href="javascript:history.go(-1)">返回上一页</a>}
          >
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
              <Form.Item {...formItemLayout} label="商品类型">
                {getFieldDecorator('goods_type_id',{
                  initialValue:  this.state.selected
                  ?  this.state.selected
                  : undefined
                })(
                  <Select
                    style={{ width: 200 }}
                  >
                    <Option key={'0'}>{'请选择类型'}</Option>
                    {!!this.state.data.goods_types && this.state.data.goods_types.map((option) => {
                      return (<Option key={option.id.toString()}>{option.name}</Option>)
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="属性名称">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入属性名称" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="属性描述">
                {getFieldDecorator('description',{
                    initialValue: ''
                  })(
                  <TextArea
                    style={{ width: 400 }}
                    placeholder="请输入属性描述"
                    autosize={{ minRows: 3, maxRows: 5 }}
                  />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="显示样式">
                {getFieldDecorator('style',{
                    initialValue: 1
                  })(
                  <RadioGroup>
                    <Radio value={1}>{'多选'}</Radio>
                    <Radio value={2}>{'单选'}</Radio>
                    <Radio value={3}>{'文本'}</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
              {formItems}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.add} style={{ width: '400px' }}>
                  <Icon type="plus" /> 添加属性值
                </Button>
              </Form.Item>
              <Form.Item {...formItemLayout} label="排序">
                {getFieldDecorator('sort',{
                    initialValue: 0
                  })(
                  <InputNumber style={{ width: 200 }} placeholder="排序" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status',{
                    initialValue: true,
                    valuePropName: 'checked'
                  })(
                  <Switch checkedChildren="正常" unCheckedChildren="禁用" />,
                )}
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CreatePage;
