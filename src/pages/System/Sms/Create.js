import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { stringify } from 'qs';
import styles from './Style.less';

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
  Table,
  Badge,
  Menu,
  Dropdown,
  Divider,
  List,
  Avatar,
  Popconfirm,
  AutoComplete
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class CreatePage extends PureComponent {
  state = {
    data:false,
    msg: '',
    url: '',
    status: '',
    loading: false,
    phones:false
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {
    // 获得url参数
    const params = this.props.location.query;

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'action/post',
          payload: {
            actionUrl: 'admin/sms/sendImportDataSms',
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
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    // 分页切换
    const importData = (fileId) => {

      this.setState({loading: true});

      this.props.dispatch({
        type: 'action/get',
        payload: {
          actionUrl: 'admin/sms/import',
          fileId: fileId, // 分页数量
        },
        callback : res => {
          this.setState({phones:res.data,loading: false});
          message.success(res.msg);
        }
      });
    };

    return (
      <PageHeaderWrapper title={false}>
        <Card
          title="发送短信"
          bordered={false}
          extra={<a href="javascript:history.go(-1)">返回上一页</a>}
        >
        <div className={styles.container}>
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
              <Form.Item {...formItemLayout} label="手机号码">
                {getFieldDecorator('phone',{
                    initialValue: this.state.phones
                  })(
                  <TextArea style={{ width:400 }} autoSize={{ minRows: 4, maxRows: 15 }}/>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="导入手机号">
                <Upload
                  showUploadList = {false}
                  name={'file'}
                  action={'/api/admin/file/upload'}
                  headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                  beforeUpload = {(file) => {
                    let canUpload = false;
                    let limitType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
                    for(var i = 0; i < limitType.length; i++) {
                      if(limitType[i] == file.type) {
                        canUpload = true;
                      }
                    }
                    if (!canUpload) {
                      message.error('请上传xlsx格式的文件!');
                      return false;
                    }
                    const isLtSize = file.size / 1024 / 1024 < 200;
                    if (!isLtSize) {
                      message.error('文件大小不可超过'+200+'MB!');
                      return false;
                    }
                    return true;
                  }}
                  onChange = {(info) => {
                    if (info.file.status === 'done') {
                      importData(info.file.response.data.id)
                    } else if (info.file.status === 'error') {
                      message.error('上传失败！');
                    }
                  }}
                >
                  <Button ><Icon type="upload" /> 上传Excel文件</Button>
                </Upload>
              </Form.Item>
              <Form.Item {...formItemLayout} label="短信内容">
                {getFieldDecorator('content')(
                  <TextArea style={{ width:400 }} rows={4} />
                )}
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
        </div>
      </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreatePage;