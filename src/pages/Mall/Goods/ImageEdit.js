import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './Style.less';
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
  Steps,
  Cascader,
  TreeSelect,
  Divider,
  Typography,
  Table,
  Popconfirm,
  Affix
} from 'antd';

const {  RangePicker } = DatePicker;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { Step } = Steps;
const { TreeNode } = TreeSelect;
const { Title } = Typography;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class EditPage extends PureComponent {

  state = {
    goodsId:false,
    fileList:false,
    previewImage:false,
    previewVisible:false
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {

    // 获得url参数
    const params = this.props.location.query;

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/imageEdit',
        ...params,
      },
      callback: res => {
        if (res) {
          this.setState({
            loading: false,
            goodsId: params.id,
            fileList: res.data.cover_id
          });
        }
      },
    });

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values['file_list'] = this.state.fileList;
      values['goods_id'] = this.state.goodsId;
      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: {
            actionUrl: 'admin/goods/imageSave',
            ...values,
          },
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

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

    let state = {
      loading: false,
    };

    // 多图片上传模式
    let uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const handleCancel = () => {
      this.setState({
        previewImage : null,
        previewVisible : false,
      });
    };

    const tabOnChange = (key) => {
      if(key == 1) {
        router.push('/mall/goods/edit?id='+this.state.goodsId);
      }
    }

    return (
      <PageHeaderWrapper title={false}>
        <div style={{background:'#fff'}}>
          <Tabs defaultActiveKey="2" onChange={tabOnChange} tabBarExtraContent={<a href="javascript:history.go(-1)">返回上一页&nbsp;&nbsp;&nbsp;&nbsp;</a>}>
            <TabPane tab="编辑商品" key="1"></TabPane>
            <TabPane tab="编辑图片" key="2">
            <div className="steps-content" style={{width:'100%',margin:'20px'}}>
              <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                <Form.Item
                  {...formItemLayout}
                >
                  <Upload
                    name={'file'}
                    listType={"picture-card"}
                    fileList={this.state.fileList}
                    multiple={true}
                    onPreview={(file) => {
                      this.setState({
                        previewImage : file.url || file.thumbUrl,
                        previewVisible : true,
                      })
                    }}
                    action={'/api/admin/picture/upload'}
                    headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                    beforeUpload = {(file) => {
                      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                        message.error('请上传jpg或png格式的图片!');
                        return false;
                      }
                      const isLtSize = file.size / 1024 / 1024 < 2;
                      if (!isLtSize) {
                        message.error('图片大小不可超过2MB!');
                        return false;
                      }
                      return true;
                    }}
                    onChange = {(info) => {
                      let fileList = info.fileList;
                      fileList = fileList.slice(-5);
                      fileList = fileList.map((file) => {
                        if (file.response) {
                          file.url = file.response.data.url;
                          file.uid = file.response.data.id;
                          file.id = file.response.data.id;
                        }
                        return file;
                      });
    
                      fileList = fileList.filter((file) => {
                        if (file.response) {
                          return file.response.status === 'success';
                        }
                        return true;
                      });
    
                      this.setState({
                        fileList : fileList,
                      });
                    }}
                  >
                    {this.state.fileList.length >= 5 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={this.state.previewVisible}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img style={{ width: '100%' }} src={this.state.previewImage} />
                  </Modal>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
                  <Button href="#/admin/mall/goods/index">
                    返回商品列表
                  </Button>
                  &nbsp;&nbsp;
                  <Button type="primary" htmlType="submit">
                    确认提交
                  </Button>
                </Form.Item>
              </Form>
            </div>
            </TabPane>
          </Tabs>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default EditPage;